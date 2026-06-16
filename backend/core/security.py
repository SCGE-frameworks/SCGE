from datetime import datetime, timedelta

import jwt
from fastapi import Depends
from fastapi.security import HTTPBearer
from passlib.context import CryptContext

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from core.responses import error_message

pwd_context = CryptContext(schemes=["bcrypt"])
security = HTTPBearer()


def hash_password(password: str):
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Senha muito longa")

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            return error_message("Token inválido", code="INVALID_TOKEN", status_code=401)
        return {"user_id": user_id}

    except jwt.ExpiredSignatureError:
        return error_message("Token expirado", code="EXPIRED_TOKEN", status_code=401)
    except jwt.InvalidTokenError:
        return error_message("Token inválido", code="INVALID_TOKEN", status_code=401)


def get_current_user(credentials: HTTPBearer = Depends(security)):
    token = credentials.credentials
    return verify_token(token)
