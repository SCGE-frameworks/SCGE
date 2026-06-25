import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
PASSWORD_RESET_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", "15"))

_cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
CORS_ORIGINS = [origin.strip() for origin in _cors_origins.split(",") if origin.strip()]

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
