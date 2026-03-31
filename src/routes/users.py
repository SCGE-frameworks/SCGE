from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def list_users():
    return {"message": "Lista de usuarios"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"Detalhes do usuario {user_id}"}


@router.post("/")
def create_user():
    return {"message": "Usuario criado com sucesso"}


@router.put("/{user_id}")
def update_user(user_id: int):
    return {"message": f"Usuario {user_id} atualizado com sucesso"}


@router.delete("/{user_id}")
def delete_user(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
