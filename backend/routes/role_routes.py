from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core import get_current_user
from database import get_db
from schemas import RoleCreate
from services import (
    role_create_service,
    role_delete_service,
    role_list_service,
    role_update_service,
)

router = APIRouter(prefix="/roles", tags=["Roles"], dependencies=[Depends(get_current_user)])


@router.get("/")
def list_roles(db: Session = Depends(get_db)):
    return role_list_service(db)


@router.post("/")
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    return role_create_service(role, db)


@router.put("/{role_id}")
def update_role(role_id: int, role: RoleCreate, db: Session = Depends(get_db)):
    return role_update_service(role_id, role, db)


@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    return role_delete_service(role_id, db)
