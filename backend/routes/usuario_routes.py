from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.usuario import criar_usuario_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def listar_usuarios():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/create")
async def criar_usuario(req: Request, db: Session = Depends(get_db)):
    data = await req.json()

    respose = criar_usuario_service(data, db)
    return respose

@router.put("/update/{user_id}")
def atualizar_usuario(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/delete/{user_id}")
def deletar_usuario(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
