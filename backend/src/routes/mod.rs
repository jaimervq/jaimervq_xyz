use axum::response::Html;
use axum::{extract::Json, http::StatusCode};
use rand::rng;
use rand::seq::IteratorRandom;
use reqwest::Client;
use serde::Deserialize;
use std::env;
use std::fs;

pub mod like_handler;

const ALL_NODES_REPO: &str = "https://api.github.com/repos/jaimervq/all_nodes";

pub async fn random_greeting() -> String {
    // Read the whole file as a string
    let data = fs::read_to_string("content/phrases.txt")
        .unwrap_or_else(|_| "Hello from Rust!".to_string());

    // Split into lines and collect non-empty ones
    let lines: Vec<&str> = data
        .lines()
        .filter(|line: &&str| !line.trim().is_empty())
        .collect();

    let mut rng_ = rng();
    let chosen = lines.iter().choose(&mut rng_).unwrap();

    chosen.to_string()
}

#[derive(Deserialize)]
struct RepoInfo {
    stargazers_count: u32,
    description: String,
}

pub async fn all_nodes_info() -> Html<String> {
    let client: Client = Client::new();
    let res: RepoInfo = client
        .get(ALL_NODES_REPO)
        .header("User-Agent", "rust-client")
        .send()
        .await
        .unwrap()
        .json::<RepoInfo>()
        .await
        .unwrap_or_else(|err| panic!("HTTP request failed: {:?}", err));

    Html(format!(
        "{}. Currently has {} stargazers.",
        res.description, res.stargazers_count
    ))
}

#[derive(Deserialize)]
pub struct ContactForm {
    name: String,
    email: String,
    message: String,
}

#[axum::debug_handler]
pub async fn handle_contact(form: Json<ContactForm>) -> StatusCode {
    let token = env::var("PUSHBULLET_TOKEN").expect("Missing PUSHBULLET_TOKEN");

    let body = format!(
        "New Contact Message\n\nFrom: {}\nEmail: {}\n\n{}",
        form.name, form.email, form.message
    );

    let client = reqwest::Client::new();
    let res = client
        .post("https://api.pushbullet.com/v2/pushes")
        .bearer_auth(token)
        .json(&serde_json::json!({
            "type": "note",
            "title": "📩 jaimervq.xyz",
            "body": body,
        }))
        .send()
        .await;

    match res {
        Ok(r) if r.status().is_success() => StatusCode::OK,
        _ => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
