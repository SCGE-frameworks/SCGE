from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login():
    pass

@router.post("/register")
def register():
    pass

@router.post("/logout")
def logout():
    pass

@router.post("/forgot-password")
def forgot_password():
    pass


