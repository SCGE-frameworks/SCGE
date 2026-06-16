from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from core import create_access_token, error_message, success_message, verify_password
from models import Role, User
from schemas import AuthRequest


def auth_login(login_data: AuthRequest, db: Session):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not user.is_active:
        return error_message("Invalid credentials", code="USER_NOT_FOUND", status_code=404)

    if not verify_password(login_data.password, user.password_hash):
        return error_message("Invalid credentials", code="INVALID_CREDENTIALS", status_code=401)

    token = create_access_token({"sub": str(user.id)})

    return success_message(
        "Login successful",
        data={"access_token": token, "token_type": "bearer"},
    )


def get_me_service(current_user: dict, db: Session):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if not user or not user.is_active:
        return error_message("User not found", code="USER_NOT_FOUND", status_code=404)

    role_name = None
    if user.role_id:
        role = db.query(Role).filter(Role.id == user.role_id).first()
        role_name = role.name if role else None

    return success_message("Authenticated user", data=user.to_dict(role_name=role_name))
