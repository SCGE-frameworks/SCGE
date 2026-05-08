from sqlalchemy.orm import Session
from models.usuario import Usuario
from utils.responses import error_message, success_message


def criar_usuario_service(data, db: Session):
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

    email_existe = db.query(Usuario).filter(Usuario.email == email).first()
    if email_existe:
        return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    novo_usuario = Usuario(nome=nome, email=email, senha=senha)
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return success_message(
        "Usuario cadastrado com sucesso",
        {"id": novo_usuario.id, "name": novo_usuario.nome, "email": novo_usuario.email}
    )
