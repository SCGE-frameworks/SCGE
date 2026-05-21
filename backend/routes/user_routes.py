from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.user_schemas import UserCreate
from services.user_services import create_user_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def list_users():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/create")
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    response = create_user_service(user, db)
    return response

@router.put("/update/{user_id}")
def update_user(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/delete/{user_id}")
def delete_user(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
