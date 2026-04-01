from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/")
def list_items():
    return {"message": "Lista de itens"}


@router.get("/{item_id}")
def get_item(item_id: int):
    return {"message": f"Detalhes do item {item_id}"}


@router.post("/create")
def create_item():
    return {"message": "Item criado com sucesso"}


@router.put("/update/{item_id}")
def update_item(item_id: int):
    return {"message": f"Item {item_id} atualizado com sucesso"}


@router.delete("/delete/{item_id}")
def delete_item(item_id: int):
    return {"message": f"Item {item_id} removido com sucesso"}
