from fastapi import HTTPException
from sqlalchemy.orm import Session

from core import (
    create_access_token,
    create_reset_token,
    error_message,
    hash_password,
    success_message,
    verify_password,
    verify_reset_token,
)
from models import User
from schemas import AuthRequest, ForgotPasswordRequest, ResetPasswordRequest
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


def forgot_password_service(payload: ForgotPasswordRequest, db: Session):
    user = db.query(User).filter(User.email == payload.email, User.is_active.is_(True)).first()
    reset_token = create_reset_token(user.id) if user else None

    return success_message(
        "If the email is registered, use the reset token to set a new password",
        data={"reset_token": reset_token},
    )


def reset_password_service(payload: ResetPasswordRequest, db: Session):
    try:
        user_id = verify_reset_token(payload.reset_token)
    except HTTPException:
        return error_message("Invalid reset token", code="INVALID_RESET_TOKEN", status_code=401)

    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()

    if not user:
        return error_message("Invalid reset token", code="INVALID_RESET_TOKEN", status_code=401)

    user.password_hash = hash_password(payload.password)
    db.commit()

    return success_message("Password reset successfully")
