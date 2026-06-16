from sqlalchemy.orm import Session

from core import error_message, hash_password, success_message
from models import Role, User
from schemas import UserCreate, UserUpdate


def _get_role_name(db: Session, role_id: int | None) -> str | None:
    if not role_id:
        return None
    role = db.query(Role).filter(Role.id == role_id).first()
    return role.name if role else None


def get_users_service(db: Session):
    users = db.query(User).filter(User.is_active.is_(True)).all()

    if not users:
        return error_message("No users found", code="USERS_NOT_FOUND", status_code=404)

    users_data = [
        user.to_dict(role_name=_get_role_name(db, user.role_id)) for user in users
    ]

    return success_message("Users retrieved successfully", data={"users": users_data})


def get_user_service(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()

    if not user:
        return error_message("User not found", code="USER_NOT_FOUND", status_code=404)

    return success_message(
        "User retrieved successfully",
        data=user.to_dict(role_name=_get_role_name(db, user.role_id)),
    )


def create_user_service(user: UserCreate, db: Session):
    if db.query(User).filter(User.email == user.email).first():
        return error_message("Email already registered", code="EMAIL_IN_USE", status_code=400)

    if not db.query(Role).filter(Role.id == user.role_id, Role.is_active.is_(True)).first():
        return error_message("Invalid role", code="INVALID_ROLE", status_code=400)

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        role_id=user.role_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return success_message(
        "User created successfully",
        data=new_user.to_dict(role_name=_get_role_name(db, new_user.role_id)),
    )


def update_user_service(user_id: int, data: UserUpdate, db: Session):
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()

    if not user:
        return error_message("User not found", code="USER_NOT_FOUND", status_code=404)

    if data.email and data.email != user.email:
        if db.query(User).filter(User.email == data.email).first():
            return error_message("Email already registered", code="EMAIL_IN_USE", status_code=400)

    if data.role_id is not None:
        if not db.query(Role).filter(Role.id == data.role_id, Role.is_active.is_(True)).first():
            return error_message("Invalid role", code="INVALID_ROLE", status_code=400)
        user.role_id = data.role_id

    if data.name is not None:
        user.name = data.name
    if data.email is not None:
        user.email = data.email
    if data.password is not None:
        user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)

    return success_message(
        "User updated successfully",
        data=user.to_dict(role_name=_get_role_name(db, user.role_id)),
    )


def delete_user_service(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()

    if not user:
        return error_message("User not found", code="USER_NOT_FOUND", status_code=404)

    user.is_active = False
    db.commit()
    db.refresh(user)

    return success_message(
        "User deactivated successfully",
        data=user.to_dict(role_name=_get_role_name(db, user.role_id)),
    )
