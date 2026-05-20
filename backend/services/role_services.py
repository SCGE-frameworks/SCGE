from sqlalchemy.orm import Session
from models.user import User
from models.cargo import Cargos
from utils.responses import error_message, success_message

def require_role(user_id, cargo, db: Session):
    users = db.query(User).filter(User.id == user_id).first()
    cargo = db.query(Cargos).filter(Cargos.nome.like(f"%{cargo}%")).first()

    if not users:
        return error_message("Nenhum usuário encontrado", code="USERS_NOT_FOUND", status_code=404)

    if cargo is None:
        return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)

    if(not users[0].cargo_id):
        return error_message("O usuário não tem um cargo atribuído", code="ROLE_NOT_FOUND", status_code=404)

    if(users[0].cargo_id == cargo.id):
        return error_message("O usuário não tem permissão para acessar esta funcionalidade", code="FORBIDDEN", status_code=403)

    return success_message("Usuário tem permissão para acessar esta funcionalidade", data={"user_id": users[0].id, "cargo": cargo.name}, db=db)
