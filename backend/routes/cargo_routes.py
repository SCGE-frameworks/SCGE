from fastapi import APIRouter

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/")
def listar_cargos():
    return {"message": "Lista de cargos"}


@router.post("/create")
def criar_cargo():
    return {"message": "Cargo cadastrado com sucesso!"}


@router.put("/update/{role_id}")
def atualizar_cargo(role_id: int):
    return {"message": f"Cargo {role_id} atualizado com sucesso!"}


@router.delete("/delete/{role_id}")
def deletar_cargo(role_id: int):
    return {"message": f"Cargo {role_id} excluido com sucesso!"}