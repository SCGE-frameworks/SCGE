from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.user import User
from models.role import Role
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

def get_me_service(current_user, db: Session):
    if isinstance(current_user, JSONResponse):
        return current_user

    user_id = current_user.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return error_message("Usuário não encontrado", code="USER_NOT_FOUND", status_code=404)

    cargo = None
    if user.cargo_id:
        role = db.query(Role).filter(Role.id == user.cargo_id).first()
        cargo = role.nome if role else None

    return success_message("Usuário autenticado", data={
        "nome": user.nome,
        "email": user.email,
        "cargo": cargo
    })