from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.user_schemas import UserCreate, UserUpdate
from services.user_services import create_user_service, get_user_service, get_users_service, update_user_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return get_users_service(db)

@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_service(user_id, db)

@router.post("/create")
def create_user(user: UserCreate, db: Session = Depends(get_db)):\
    return create_user_service(user, db)

@router.put("/update/{user_id}")
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    return update_user_service(user_id, data, db)


@router.delete("/delete/{user_id}")
def delete_user(user_id: int):
    return {"message": f"Usuario {user_id} removido com sucesso"}
