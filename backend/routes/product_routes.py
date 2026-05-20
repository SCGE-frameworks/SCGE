from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.product_schemas import ProductCreate
from services.product_services import create_product_service

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
def list_products():

    return {"message": "Lista de produtos"}


@router.get("/{product_id}")
def get_product(product_id: int):

    return {"message": f"Detalhes do produto {product_id}"}


@router.post("/create")
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    return create_product_service(product_data, db)

@router.put("/update/{product_id}")
def update_product(product_id: int):

    return {"message": f"Produto {product_id} atualizado com sucesso"}


@router.delete("/delete/{product_id}")
def delete_product(product_id: int):

    return {"message": f"Produto {product_id} removido com sucesso"}
