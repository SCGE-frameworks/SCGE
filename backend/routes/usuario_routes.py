from fastapi import APIRouter, Request
from services.usuario import criar_usuario_service

from models import users

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def listar_usuarios():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/create")
async def criar_usuario(req: Request):
    data = await req.json()

    respose = criar_usuario_service(data)
    return respose

@router.put("/update/{user_id}")
def atualizar_usuario(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/delete/{user_id}")
def deletar_usuario(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
