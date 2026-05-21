from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from schemas.product_schemas import ProductResponse, ProductUpdate
from services.product_services import (
    delete_product,
    get_products,
    update_product,
)

router = APIRouter(prefix="/products", tags=["Products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.patch("/{product_id}", response_model=ProductResponse)
def update_product_route(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    data = product_data.model_dump(exclude_unset=True)

    return update_product(db, product_id, data)


@router.delete("/{product_id}")
def delete_product_route(
    product_id: int,
    db: Session = Depends(get_db)
):
    return delete_product(db, product_id)