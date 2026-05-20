from sqlalchemy.orm import Session
from backend.database import get_db
from models.user import User
from models.cargo import Cargo
from utils.responses import error_message, success_message

def require_role(current_user: User = None, cargo: str = None, db: Session = None):
    
    if cargo is None:
        return error_message("É preciso especificar um cargo", code="ROLE_NOT_FOUND", status_code=404)

    cargo = db.query(Cargo).filter(Cargo.nome.like(f"%{cargo}%")).first()

    if not current_user or not current_user.ativo:
        return error_message("Nenhum usuário encontrado", code="USERS_NOT_FOUND", status_code=404)

    if cargo is None:
        return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)

    if(not current_user.cargo_id):
        return error_message("O usuário não tem um cargo atribuído", code="ROLE_NOT_FOUND", status_code=404)

    if(current_user.cargo_id == cargo.id):
        return error_message("O usuário não tem permissão para acessar esta funcionalidade", code="FORBIDDEN", status_code=403)

    return success_message("Usuário tem permissão para acessar esta funcionalidade", data={"user_id": current_user.id, "cargo": cargo.name}, db=db)
