from fastapi import APIRouter, Depends
from requests import Session
from database import get_db
from services.role_services import role_create_service
from schemas.role_schemas import RoleCreate
router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/")
def list_roles():
    return {"message": "Lista de cargos"}


@router.post("/create")
def create_role(cargo: RoleCreate, db: Session = Depends(get_db)):
    return role_create_service(cargo.nome, db)

@router.put("/update/{role_id}")
def update_role(role_id: int):
    return {"message": f"Cargo {role_id} atualizado com sucesso!"}


@router.delete("/delete/{role_id}")
def delete_role(role_id: int):
    return {"message": f"Cargo {role_id} excluido com sucesso!"}
