from fastapi import APIRouter

router = APIRouter(prefix="/movements", tags=["Stocks Movements"])

@router.get("/")
def list_movements():
    return {"message": "Lista de movimentações de estoque"}

@router.post("/create_entry")
def create_entry():
    return {"message": "Entrada de estoque cadastrada com sucesso!"}

@router.post("/create_exit")
def create_exit():
    return {"message": "Saída de estoque cadastrada com sucesso!"}

@router.get("/{movement_id}")
def get_movement(movement_id: int):
    return {"message": f"Detalhes da movimentação de estoque {movement_id}"}