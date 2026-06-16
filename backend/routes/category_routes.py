from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core import get_current_user
from database import get_db
from schemas import CategoryCreate, CategoryUpdate
from services import (
    create_category_service,
    delete_category_service,
    get_category_by_id_service,
    list_categories_service,
    update_category_service,
)

router = APIRouter(prefix="/categories", tags=["Categories"], dependencies=[Depends(get_current_user)])


@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return list_categories_service(db)


@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db)):
    return get_category_by_id_service(category_id, db)


@router.post("/")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return create_category_service(category, db)


@router.put("/{category_id}")
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
):
    return update_category_service(category_id, category, db)


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    return delete_category_service(category_id, db)
