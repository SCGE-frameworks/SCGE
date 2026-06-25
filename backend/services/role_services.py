from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from core import error_message, get_current_user, success_message
from database import get_db
from models import Role, User
from schemas import RoleCreate


def require_role(role_name: Optional[str] = None):
    def role_checker(
        current_user: dict = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
        if role_name is None:
            return error_message("Role name is required", code="ROLE_NOT_FOUND", status_code=404)

        if not isinstance(current_user, dict) or not current_user.get("user_id"):
            return error_message("User not found", code="USERS_NOT_FOUND", status_code=404)

        role = db.query(Role).filter(Role.name.ilike(f"%{role_name}%")).first()
        user = db.query(User).filter(User.id == current_user["user_id"]).first()

        if role is None:
            return error_message("Role not found", code="ROLE_NOT_FOUND", status_code=404)

        if not user or not user.role_id:
            return error_message("User has no assigned role", code="ROLE_NOT_FOUND", status_code=404)

        if user.role_id != role.id:
            return error_message("Forbidden", code="FORBIDDEN", status_code=403)

        return success_message(
            "Access granted",
            data={"role_check": {"user_id": user.id, "role": role.name}},
        )

    return role_checker


def role_create_service(role_data: RoleCreate, db: Session):
    if db.query(Role).filter(Role.name == role_data.name).first():
        return error_message("Role already exists", code="ROLE_ALREADY_EXISTS", status_code=400)

    new_role = Role(name=role_data.name, access_level=role_data.access_level, is_active=role_data.is_active)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    return success_message(
        "Role created successfully", 
        data={"role": new_role.to_dict()}
    )


def role_update_service(role_id: int, role_data: RoleCreate, db: Session):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        return error_message("Role not found", code="ROLE_NOT_FOUND", status_code=404)

    existing_role = (
        db.query(Role).filter(Role.name == role_data.name, Role.id != role_id).first()
    )
    if existing_role:
        return error_message("Role already exists", code="ROLE_ALREADY_EXISTS", status_code=400)

    role.name = role_data.name
    role.access_level = role_data.access_level
    role.is_active = role_data.is_active
    db.commit()
    db.refresh(role)

    return success_message(
        "Role updated successfully", 
        data={"role": role.to_dict()}
    )


def role_delete_service(role_id: int, db: Session):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        return error_message("Role not found", code="ROLE_NOT_FOUND", status_code=404)

    if not role.is_active:
        return error_message("Role is already inactive", code="ROLE_ALREADY_INACTIVE", status_code=400)

    role.is_active = False
    db.commit()
    db.refresh(role)

    return success_message(
        "Role deactivated successfully", 
        data={"role": role.to_dict()}
    )


def role_list_service(db: Session):
    roles = db.query(Role).filter(Role.is_active.is_(True)).all()
    return success_message(
        "Roles retrieved successfully",
        data={"roles": [role.to_dict() for role in roles]},
    )
