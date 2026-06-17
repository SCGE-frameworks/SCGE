from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core import require_min_access_level
from models import AccessLevels
from models import User
from core import success_message
from database import get_db
from schemas import AuthRequest, UserCreate
from services import auth_login, create_user_service, get_me_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(auth_data: AuthRequest, db: Session = Depends(get_db)):
    return auth_login(auth_data, db)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.ADMIN))):
    return create_user_service(user, db)


@router.get("/me")
def me(current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER)), db: Session = Depends(get_db)):
    return get_me_service(current_user, db)


@router.post("/logout")
def logout(current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER))):
    return success_message("Logout successful")


@router.post("/forgot-password")
def forgot_password():
    pass
