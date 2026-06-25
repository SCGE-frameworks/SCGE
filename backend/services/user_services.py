from typing import Optional, Tuple

from sqlalchemy.orm import Session

from core import error_message, hash_password, success_message
from models import Role, User
from schemas import UserCreate, UserUpdate


def _get_role_info(db: Session, role_id: Optional[int]) -> Tuple[Optional[str], Optional[int]]:
    if not role_id:
        return None, None
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return None, None
    return role.name, role.access_level.value


def _user_to_dict(user: User, db: Session) -> dict:
    role_name, access_level = _get_role_info(db, user.role_id)
    return user.to_dict(role_name=role_name, access_level=access_level)


def get_users_service(db: Session):
    users = db.query(User).filter(User.is_active.is_(True)).all()

    if not users:
        return error_message("No users found", code="USERS_NOT_FOUND", status_code=404)

    users_data = [_user_to_dict(user, db) for user in users]

    return success_message("Users retrieved successfully", data={"users": users_data})


def get_user_service(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()

    if not user:
        return error_message("User not found", code="USER_NOT_FOUND", status_code=404)

    return success_message(
        "User retrieved successfully",
        data={"user": _user_to_dict(user, db)},
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
        data={"user": _user_to_dict(new_user, db)},
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
        data={"user": _user_to_dict(user, db)},
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
        data={"user": _user_to_dict(user, db)},
    )
