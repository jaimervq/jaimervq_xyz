use dotenvy::dotenv;
use sqlx::{query, PgPool, Row};
use std::env;

#[tokio::test]
async fn test_insert_and_select_greeting() -> Result<(), sqlx::Error> {
    dotenv().ok(); // Load .env

    let db_url: String = env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let pool: sqlx::Pool<sqlx::Postgres> = PgPool::connect(&db_url).await?;

    // Insert a greeting
    query("INSERT INTO greetings (message) VALUES ($1)")
        .bind("Hello, Traveller!")
        .execute(&pool)
        .await?;

    // Select it back
    let results: Vec<sqlx::postgres::PgRow> =
        query("SELECT message FROM greetings ORDER BY id DESC LIMIT 1")
            .fetch_all(&pool)
            .await?;

    assert_eq!(
        results[0].try_get("message").unwrap_or("Fail"),
        "Hello, Traveller!"
    );

    Ok(())
}
