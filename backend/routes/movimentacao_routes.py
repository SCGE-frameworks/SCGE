from fastapi import APIRouter

router = APIRouter(prefix="/movements", tags=["Stocks Movements"])

@router.get("/")
def listar_movimentacoes():
    return {"message": "Lista de movimentações de estoque"}

@router.post("/create_entry")
def cadastrar_entrada():
    return {"message": "Entrada de estoque cadastrada com sucesso!"}

@router.post("/create_exit")
def cadastrar_saida():
    return {"message": "Saída de estoque cadastrada com sucesso!"}

@router.get("/{movement_id}")
def detalhes_movimentacao(movement_id: int):
    return {"message": f"Detalhes da movimentação de estoque {movement_id}"}