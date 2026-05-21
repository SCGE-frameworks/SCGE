from sqlalchemy.orm import Session
from schemas.user_schemas import UserCreate, UserUpdate
from models.user import User
from utils.responses import error_message, success_message
from utils.auth import hash_password

def get_users_service(db: Session):
    
    users = db.query(User).all()
    if not users:
        return error_message("Nenhum usuário encontrado", code="USERS_NOT_FOUND", status_code=404)

    user_data = []

    for user in users:
        if user.ativo:
            user_data.append({"id": user.id, "nome": user.nome, "email": user.email, "ativo": user.ativo})
    
    return success_message("Usuários encontrados com sucesso", data={"users": user_data})

def get_user_service(user_id: int, db: Session):

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.ativo:
        return error_message("Usuario nao encontrado", code="USER_NOT_FOUND", status_code=404)

    return success_message(
        "Usuario encontrado com sucesso",
        {"id": user.id, "nome": user.nome, "email": user.email, "cargo_id": user.cargo_id}
    )

def create_user_service(user: UserCreate, db: Session):

    nome = user.nome
    email = user.email
    senha = user.senha
    cargo_id = user.cargo_id
    if not nome or not email or not senha or not cargo_id:
        return error_message(
            "nome, email, senha e cargo_id sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    email_existing = db.query(User).filter(User.email == email).first()
    if email_existing:
        return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    hashed_password = hash_password(senha)
    print(len(hashed_password))

    new_user = User(nome=nome, email=email, senha=hashed_password, cargo_id=cargo_id)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return success_message(
        "Usuario cadastrado com sucesso",
        {"id": new_user.id, "nome": new_user.nome, "email": new_user.email, "cargo_id": new_user.cargo_id}
    )

def update_user_service(user_id: int, data: UserUpdate, db: Session):
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.ativo:
        return error_message("Usuario não encontrado", code="USER_NOT_FOUND", status_code=404)
    
    if data.email and data.email != user.email:
        email_existing = db.query(User).filter(User.email == data.email).first()
        if email_existing:
            return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    if data.nome is not None:
        user.nome = data.nome
    if data.email is not None:
        user.email = data.email
    if data.senha is not None:
        user.senha = hash_password(data.senha)
    if data.cargo_id is not None:
        user.cargo_id = data.cargo_id

    db.commit()
    db.refresh(user)

    return success_message(
        "Usuario atualizado com sucesso",
        {"id": user.id, "nome": user.nome, "email": user.email, "cargo_id": user.cargo_id},
    )

def delete_user_service(user_id: int, db: Session):

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.ativo:
        return error_message("Usuário não encontrado", code="USER_NOT_FOUND", status_code=404)
    
    user.ativo = False

    db.commit()
    db.refresh(user)

    return success_message(
        "Usuário excluído com sucesso",
        {"id": user.id, "nome": user.nome, "email": user.email, "cargo_id": user.cargo_id, "ativo": user.ativo}
    )