from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session 
from core import require_min_access_level, get_current_user
from database import get_db
from schemas import ProductCreate, ProductUpdate
from services import (
    create_product_service,
    delete_product_service,
    get_product_by_id_service,
    list_products_service,
    update_product_service,
)
from models import AccessLevels, User

router = APIRouter(prefix="/products", tags=["Products"], dependencies=[Depends(get_current_user)])


@router.get("/")
def list_products(db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER))):
    return list_products_service(db)


@router.get("/{product_id}")
def get_product_by_id(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER))):
    return get_product_by_id_service(product_id=product_id, db=db)


@router.post("/")
def create_product(product_data: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.MANAGER))):
    return create_product_service(product_data, db)


@router.put("/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_access_level(AccessLevels.MANAGER))):
    return update_product_service(product_id, product_data, db)


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.MANAGER))):
    return delete_product_service(product_id, db)
