from sqlalchemy.orm import Session
from models.user import User
from utils.responses import error_message, success_message


def create_user_service(data, db: Session):
    if not isinstance(data, dict):
        return error_message(
            "Corpo da requisicao deve ser um objeto JSON",
            code="INVALID_BODY",
            status_code=422,
        )

    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    if not nome or not email or not senha:
        return error_message(
            "nome, email e senha sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    email_existe = db.query(User).filter(User.email == email).first()
    if email_existe:
        return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    new_user = User(nome=nome, email=email, senha=senha)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return success_message(
        "Usuario cadastrado com sucesso",
        {"id": new_user.id, "name": new_user.nome, "email": new_user.email}
    )
