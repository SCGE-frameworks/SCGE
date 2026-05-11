from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.user import create_user_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def list_users():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/create")
async def create_user(req: Request, db: Session = Depends(get_db)):
    data = await req.json()

    response = create_user_service(data, db)
    return response

@router.put("/update/{user_id}")
def update_user(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/delete/{user_id}")
def delete_user(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
