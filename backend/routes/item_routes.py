from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/")
def listar_itens():
    return {"message": "Lista de itens"}

@router.get("/{item_id}")
def detalhes_item(item_id: int):
    return {"message": f"Detalhes do item {item_id}"}

@router.post("/create")
def cadastrar_item():
    return {"message": "Item criado com sucesso"}

@router.put("/update/{item_id}")
def atualizar_item(item_id: int):
    return {"message": f"Item {item_id} atualizado com sucesso"}

@router.delete("/delete/{item_id}")
def deletar_item(item_id: int):
    return {"message": f"Item {item_id} removido com sucesso"}

