import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL não está definido. Crie um arquivo .env com "
        "DATABASE_URL=sqlite:///./database.db"
    )

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY não está definido. Crie um arquivo .env com "
        "SECRET_KEY=uma_chave_secreta_forte"
    )
