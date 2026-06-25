from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core import require_min_access_level
from models import AccessLevels, User
from core import get_current_user
from database import get_db
from schemas import UserCreate, UserUpdate
from services import (
    create_user_service,
    delete_user_service,
    get_user_service,
    get_users_service,
    update_user_service,
)

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(get_current_user)])


@router.get("/")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.ADMIN))):
    return get_users_service(db)


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.ADMIN))):
    return get_user_service(user_id, db)


@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.ADMIN))):
    return create_user_service(user, db)


@router.put("/{user_id}")
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.ADMIN))):
    return update_user_service(user_id, data, db)


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.ADMIN))):
    return delete_user_service(user_id, db)
