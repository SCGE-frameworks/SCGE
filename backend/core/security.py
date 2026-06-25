from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from models.role import AccessLevels
from models import Role, User
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY

pwd_context = CryptContext(schemes=["bcrypt"])
security = HTTPBearer()


def get_db():
    from database.session import SessionLocal

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password is too long")

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    ''' Exemplo de data: {"sub": str(user_id)} '''
    
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

        return {"user_id": int(user_id)}

    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from exc


def get_current_user(credentials: HTTPBearer = Depends(security), db: Session = Depends(get_db)) -> User:

    token_data = verify_token(credentials.credentials)
    user_id = token_data["user_id"]

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="user not found or inactive"
        )
    
    return user

def require_min_access_level(min_level: AccessLevels):
    def checker(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> User:

        role = db.query(Role).filter(Role.id == current_user.role_id).first()
        if not role:
            raise HTTPException(
                status_code=404,
                detail="No roles found"
            )
        
        if not role.is_active:
            raise HTTPException(
                status_code=403,
                detail="Role is inactive"
            )
        
        user_level = role.access_level

        if user_level < min_level:
            raise HTTPException(
                status_code=403,
                detail="Insufficient access level"
            )
        
        return current_user

    return checker

