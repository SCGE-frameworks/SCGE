from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.categoria_schemas import CategoriaCreate, CategoriaUpdate
from services.categoria_services import create_categoria_service, create_categoria_service, get_categoria_service, update_categoria_service, delete_categoria_service

router = APIRouter(prefix="/category", tags=["Categories"])

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    response = get_categoria_service(-1, db)
    return response


@router.get("/{category_id}")
def get_category_details(category_id: int, db: Session = Depends(get_db)):
    response = get_categoria_service(category_id, db)
    return response

@router.post("/create")
def create_category(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    response = create_categoria_service(categoria, db)
    return response

@router.put("/update/{category_id}")
def update_category(category_id: int, categoria: CategoriaUpdate, db: Session = Depends(get_db)):
    response = update_categoria_service(category_id, categoria, db)
    return response    

@router.delete("/delete/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    response = delete_categoria_service(category_id, db)
    return response
