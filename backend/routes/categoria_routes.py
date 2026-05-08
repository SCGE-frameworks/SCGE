from fastapi import APIRouter

router = APIRouter(prefix="/category", tags=["Categories"])

@router.get("/")
def listar_categorias():
    return {"message": "Lista de categorias"}


@router.get("/{category_id}")
def detalhes_categoria(category_id: int):
    return {"message": f"Detalhes da categoria {category_id}"}


@router.post("/create")
def cadastrar_categoria():
    return {"message": "Categoria cadastrada com sucesso!"}


@router.put("/update/{category_id}")
def atualizar_categoria(category_id: int):
    return {"message": f"Categoria {category_id} atualizada com sucesso!"}


@router.delete("/delete/{category_id}")
def deletar_categoria(category_id: int):
    return {"message": f"Categoria {category_id} deletada com sucesso!"}

