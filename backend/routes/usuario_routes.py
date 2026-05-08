from fastapi import APIRouter, Request
from utils.responses import success_message, error_message

from models import users

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def listar_usuarios():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/create")
async def cadastrar_usuario(req: Request):
    data = await req.json()

    if not isinstance(data, dict):
        return error_message(
            "Corpo da requisicao deve ser um objeto JSON",
            code="INVALID_BODY",
            status_code=422,
        )

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not name or not email or not password:
        return error_message(
            "name, email e password sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    for user in users:
        if user.get("email") == email:
            return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    user_id = len(users) + 1
    users.append(
        {
            "id": user_id,
            "name": name,
            "email": email,
            "password": password,
        }
    )
    return success_message(
        "Usuario cadastrado com sucesso",
        {"id": user_id, "name": name, "email": email},
    )


@router.put("/update/{user_id}")
def atualizar_usuario(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/delete/{user_id}")
def deletar_usuario(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
