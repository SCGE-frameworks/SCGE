import email
from sqlalchemy.orm import Session
from schemas.user_schemas import UserCreate
from models.user import User
from utils.responses import error_message, success_message

def get_users_service(db: Session):
    
    users = db.query(User).all()
    if not users:
        return error_message("Nenhum usuário encontrado", code="USERS_NOT_FOUND", status_code=404)
    
    return success_message("Usuários encontrados com sucesso", data=users)

def get_user_service(user_id: int, db: Session):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_message("Usuario nao encontrado", code="USER_NOT_FOUND", status_code=404)

    return success_message(
        "Usuario encontrado com sucesso",
        {"id": user.id, "nome": user.nome, "email": user.email}
    )

def create_user_service(user: UserCreate, db: Session):

    nome = user.nome
    email = user.email
    senha = user.senha
    if not nome or not email or not senha:
        return error_message(
            "nome, email e senha sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    email_existing = db.query(User).filter(User.email == email).first()
    if email_existing:
        return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    new_user = User(nome=nome, email=email, senha=senha)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return success_message(
        "Usuario cadastrado com sucesso",
        {"id": new_user.id, "nome": new_user.nome, "email": new_user.email}
    )
