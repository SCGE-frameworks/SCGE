from fastapi import APIRouter

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/")
def list_roles():
    return {"message": "Lista de cargos"}


@router.post("/create")
def create_role():
    return {"message": "Cargo cadastrado com sucesso!"}


@router.put("/update/{role_id}")
def update_role(role_id: int):
    return {"message": f"Cargo {role_id} atualizado com sucesso!"}


@router.delete("/delete/{role_id}")
def delete_role(role_id: int):
    return {"message": f"Cargo {role_id} excluido com sucesso!"}