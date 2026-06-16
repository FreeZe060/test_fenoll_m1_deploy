from fastapi import FastAPI
import mysql.connector
import os

app = FastAPI()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "ynov_ci")
    )

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.get("/users")
def get_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateur")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results
