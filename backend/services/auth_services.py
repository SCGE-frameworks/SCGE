from sqlalchemy.orm import Session

from core import create_access_token, error_message, success_message, verify_password
from models import User
from schemas import AuthRequest
from .user_services import _user_to_dict


def auth_login(login_data: AuthRequest, db: Session):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not user.is_active:
        return error_message("Invalid credentials", code="INVALID_CREDENTIALS", status_code=401)

    if not verify_password(login_data.password, user.password_hash):
        return error_message("Invalid credentials", code="INVALID_CREDENTIALS", status_code=401)

    token = create_access_token({"sub": str(user.id)})

    return success_message(
        "Login successful",
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": _user_to_dict(user, db),
        },
    )


def get_me_service(current_user: User, db: Session):
    user = db.query(User).filter(User.id == current_user.id).first()

    if not user or not user.is_active:
        return error_message("User not found", code="USER_NOT_FOUND", status_code=404)

    return success_message("Authenticated user", data=_user_to_dict(user, db))
