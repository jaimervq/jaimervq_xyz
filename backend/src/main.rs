use axum::{
    http::{HeaderValue, Method},
    routing::get,
    routing::{post, Router},
};
use dotenvy::dotenv;
mod routes;
use routes::like_handler;
use sqlx::postgres::PgPoolOptions;
use std::env;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    dotenv().ok();

    dotenvy::dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let pool = PgPoolOptions::new()
        .connect(&db_url)
        .await
        .expect("DB connect failed");

    let _cors = CorsLayer::new()
        .allow_origin(
            std::env::var("FRONTEND_URL")
                .unwrap_or("https://www.jaimervq.xyz".into())
                .parse::<HeaderValue>()
                .unwrap(),
        )
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);

    // TODO add nesting here!
    let app = Router::new()
        .route("/content/random_greeting", get(routes::random_greeting))
        .route("/content/all_nodes_info", get(routes::all_nodes_info))
        .route("/forms/contact", post(routes::handle_contact))
        .route(
            "/forms/like",
            get(like_handler::like_counter).post(like_handler::like_handler),
        )
        .layer(_cors)
        .with_state(pool)
        .into_make_service_with_connect_info::<SocketAddr>();

    println!("Backend running on http://localhost:8000");
    let listener: tokio::net::TcpListener =
        tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
