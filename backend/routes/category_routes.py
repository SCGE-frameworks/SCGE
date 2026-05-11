from fastapi import APIRouter

router = APIRouter(prefix="/category", tags=["Categories"])

@router.get("/")
def list_categories():
    return {"message": "Lista de categorias"}


@router.get("/{category_id}")
def get_category_details(category_id: int):
    return {"message": f"Detalhes da categoria {category_id}"}


@router.post("/create")
def register_category():
    return {"message": "Categoria cadastrada com sucesso!"}


@router.put("/update/{category_id}")
def update_category(category_id: int):
    return {"message": f"Categoria {category_id} atualizada com sucesso!"}


@router.delete("/delete/{category_id}")
def delete_category(category_id: int):
    return {"message": f"Categoria {category_id} deletada com sucesso!"}

