from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def fazer_login():
    pass

@router.post("/register")
def cadastrar():
    pass

@router.post("/logout")
def fazer_logout():
    pass

@router.post("/forgot-password")
def esqueci_minha_senha():
    pass


