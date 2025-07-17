use axum::{
    extract::{ConnectInfo, Json, Query, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use std::collections::HashMap;
use std::env;

#[derive(Deserialize)]
pub struct LikeRequest {
    content_id: String,
}

#[derive(Serialize)]
pub struct LikeResponse {
    success: bool,
    likes: i64,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    error: String,
}

fn hash_ip(ip: &str) -> String {
    dotenv().ok();
    let salt = env::var("IP_SALT").unwrap_or_else(|_| "fallback_salt".into());
    let mut hasher = Sha256::new();
    hasher.update(format!("{}:{}", salt, ip));
    format!("{:x}", hasher.finalize())
}

/// Extract the IP from `X-Forwarded-For` or fall back to `Request::remote_addr`
fn get_client_ip(headers: &HeaderMap, addr: std::net::SocketAddr) -> String {
    if let Some(forwarded) = headers.get("x-forwarded-for") {
        if let Ok(s) = forwarded.to_str() {
            return s.split(',').next().unwrap_or("").trim().to_string();
        }
    }
    addr.ip().to_string()
}

pub async fn like_counter(
    State(pool): State<PgPool>,
    Query(params): Query<HashMap<String, String>>,
) -> impl IntoResponse {
    let Some(id) = params.get("contentID") else {
        let body = Json(LikeResponse {
            success: false,
            likes: 0,
        });
        return (StatusCode::BAD_REQUEST, body).into_response();
    };

    let count_result =
        sqlx::query_scalar(r#"SELECT COUNT(*) FROM content_likes WHERE content_id = $1"#)
            .bind(id)
            .fetch_one(&pool)
            .await;

    match count_result {
        Ok(count) => {
            let body = Json(LikeResponse {
                success: true,
                likes: count,
            });
            (StatusCode::OK, body).into_response()
        }
        Err(err) => {
            print!("Error counting likes: {}", err);
            let body = Json(LikeResponse {
                success: false,
                likes: 0,
            });
            (StatusCode::INTERNAL_SERVER_ERROR, body).into_response()
        }
    }
}

pub async fn like_handler(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<std::net::SocketAddr>,
    Json(payload): Json<LikeRequest>,
) -> impl IntoResponse {
    let ip = get_client_ip(&headers, addr);
    let hashed_ip = hash_ip(&ip);

    // Insert only if not already liked by this IP
    let insert_result = sqlx::query(
        r#"
        INSERT INTO content_likes (content_id, hashed_ip)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        "#,
    )
    .bind(&payload.content_id)
    .bind(hashed_ip)
    .execute(&pool)
    .await;

    // Feedback
    let ok_insert = insert_result.is_ok();
    if ok_insert {
        let rows_affected = insert_result.unwrap().rows_affected();
        if rows_affected > 0 {
            let client = reqwest::Client::new();
            let token = env::var("PUSHBULLET_TOKEN").expect("Missing PUSHBULLET_TOKEN");

            let body = format!("Someone just liked content\nID: {}", payload.content_id);
            let _ = client
                .post("https://api.pushbullet.com/v2/pushes")
                .bearer_auth(token)
                .json(&serde_json::json!({
                    "type": "note",
                    "title": "💚 jaimervq.xyz",
                    "body": body,
                }))
                .send()
                .await;
        }
    }

    // Count total likes
    let count_result =
        sqlx::query_scalar(r#"SELECT COUNT(*) FROM content_likes WHERE content_id = $1"#)
            .bind(&payload.content_id)
            .fetch_one(&pool)
            .await;

    match count_result {
        Ok(count) => {
            let success = ok_insert;
            let body = Json(LikeResponse {
                success,
                likes: count,
            });
            (StatusCode::OK, body).into_response()
        }
        Err(err) => {
            print!("Error counting likes: {}", err);
            let body = Json(ErrorResponse {
                error: err.to_string(),
            });
            (StatusCode::INTERNAL_SERVER_ERROR, body).into_response()
        }
    }
}
