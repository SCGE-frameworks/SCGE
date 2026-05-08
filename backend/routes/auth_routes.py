from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/login")
def login_form():
    return {"message": "Formulario de login"}

    
@router.post("/login")
def login():
    return {"message": "Login realizado com sucesso"}


@router.get("/register")
def register_form():
    return {"message": "Formulario de cadastro"}


@router.post("/register")
def register():
    return {"message": "Usuario cadastrado com sucesso"}


@router.get("/logout")
def logout():
    return {"message": "Logout realizado com sucesso"}


@router.post("/logout")
def logout_post():
    return {"message": "Logout realizado com sucesso"}


@router.get("/forgot-password")
def forgot_password_form():
    return {"message": "Formulario de recuperacao de senha"}


@router.post("/forgot-password")
def forgot_password():
    return {"message": "Recuperacao de senha solicitada"}