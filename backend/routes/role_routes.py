from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.role_services import (
    role_create_service,
    role_delete_service,
    role_list_service,
    role_update_service,
)
from schemas.role_schemas import RoleCreate

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("/")
def list_roles(db: Session = Depends(get_db)):
    return role_list_service(db)


@router.post("/create")
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    return role_create_service(role, db)


@router.put("/update/{role_id}")
def update_role(role_id: int, role: RoleCreate, db: Session = Depends(get_db)):
    return role_update_service(role_id, role, db)


@router.delete("/delete/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    return role_delete_service(role_id, db)
