from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from schemas.user_schemas import UserCreate
from services.user_services import create_user_service
from schemas.auth_schema import AuthRequest
from services.auth_services import auth_login, get_me_service
from utils.auth import get_current_user
from utils.responses import success_message

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(auth_data: AuthRequest, db: Session = Depends(get_db)):
    return auth_login(auth_data, db)

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(user, db)

@router.get("/me")
def me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_me_service(current_user, db)

@router.post("/logout")
def logout():
    return success_message("Logout realizado com sucesso")

@router.post("/forgot-password")
def forgot_password():
    pass


