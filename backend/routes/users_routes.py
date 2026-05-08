from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

import models

router = APIRouter(prefix="/users", tags=["Users"])


def success_message(message: str, data: dict | None = None):
    return {
        "data": data or {},
        "message": message,
        "success": True,
    }


def error_message(message: str, code: str = "ERROR", status_code: int = 400):
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {"code": code, "message": message, "details": []},
            "success": False,
        },
    )


@router.get("/")
def list_users():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/create")
async def create_user(req: Request):
    data = await req.json()

    data_user = data.get("data_user")
    if not isinstance(data_user, dict):
        return error_message(
            "Campo data_user e obrigatorio e deve ser um objeto",
            code="INVALID_BODY",
            status_code=422,
        )

    name = data_user.get("name")
    email = data_user.get("email")
    password = data_user.get("password")
    if not name or not email or not password:
        return error_message(
            "name, email e password sao obrigatorios em data_user",
            code="MISSING_FIELDS",
            status_code=422,
        )

    for u in models.users:
        if u.get("email") == email:
            return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    user_id = len(models.users) + 1
    models.users.append(
        {
            "id": user_id,
            "name": name,
            "email": email,
            "password": password,
        }
    )
    data = {"id": user_id, "name": name, "email": email}
    return success_message("Usuario cadastrado com sucesso", data)


@router.put("/update/{user_id}")
def update_user(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/delete/{user_id}")
def delete_user(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
