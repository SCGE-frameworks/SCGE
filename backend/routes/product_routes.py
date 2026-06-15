from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import ProductCreate, ProductUpdate
from services import (
    create_product_service,
    delete_product_service,
    get_product_by_id_service,
    list_products_service,
    update_product_service,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
def get_all_products(
    nome: str = None,
    codigo: str = None,
    categoria_id: int = None,
    db: Session = Depends(get_db),
):
    return list_products_service(
        db=db, nome=nome, codigo=codigo, categoria_id=categoria_id
    )


@router.get("/{product_id}")
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    return get_product_by_id_service(product_id=product_id, db=db)


@router.post("/create")
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    return create_product_service(product_data, db)


@router.put("/update/{product_id}")
def update_product(
    product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db)
):
    return update_product_service(product_id, product_data, db)


@router.delete("/delete/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return delete_product_service(product_id, db)
