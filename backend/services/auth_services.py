from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.auth_schema import AuthRequest

from utils.responses import error_message, success_message
from utils.auth import (
    verify_password,
    create_access_token
)

def auth_login(login_data: AuthRequest, db: Session):

    user = db.query(User).filter(User.email == login_data.email).first()

    if not user:
        return error_message("Credenciais inválidas", code="USER_NOT_FOUND", status_code=404)

    valid_password = verify_password(
        login_data.senha,
        user.senha
    )

    if not valid_password:
        return error_message("Credenciais inválidas", code="INVALID_CREDENTIALS", status_code=401)
        
    token = create_access_token({"sub": str(user.id)})

    return success_message("Login realizado com sucesso", data={
        "access_token": token,
        "token_type": "bearer"
    })