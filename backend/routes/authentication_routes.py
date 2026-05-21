from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from schemas.user_schemas import UserCreate
from services.user_services import create_user_service
from schemas.auth_schema import AuthRequest
from services.auth_services import auth_login

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(auth_data: AuthRequest, db: Session = Depends(get_db)):
    return auth_login(auth_data, db)

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(user, db)

@router.post("/logout")
def logout():
    pass

@router.post("/forgot-password")
def forgot_password():
    pass


