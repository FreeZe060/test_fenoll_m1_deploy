from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import os

app = FastAPI()


@app.on_event("startup")
def seed_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        return
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM utilisateur WHERE identifiant = %s", (admin_email,))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO utilisateur (nom, prenom, email, identifiant, mdp, is_admin) VALUES (%s, %s, %s, %s, %s, TRUE)",
                ("Fenoll", "Loise", admin_email, admin_email, admin_password),
            )
            conn.commit()
        cursor.close()
        conn.close()
    except Exception:
        pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    nom: str
    prenom: str
    identifiant: str
    mdp: str

class LoginCredentials(BaseModel):
    identifiant: str
    mdp: str

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

@app.post("/users")
def create_user(user: UserCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO utilisateur (nom, prenom, identifiant, mdp) VALUES (%s, %s, %s, %s)",
        (user.nom, user.prenom, user.identifiant, user.mdp)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User created"}

@app.post("/login")
def login(credentials: LoginCredentials):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM utilisateur WHERE identifiant = %s AND mdp = %s",
        (credentials.identifiant, credentials.mdp)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM utilisateur WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User deleted"}
