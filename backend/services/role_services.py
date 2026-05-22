from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.cargo import Cargo
from utils.responses import error_message, success_message
from utils.auth import get_current_user

def require_role(cargo: str = None):
    
    def role_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
        cargo = cargo
    ):

        if cargo is None:
            return error_message("É preciso especificar um cargo", code="ROLE_NOT_FOUND", status_code=404)

        if not current_user:
            return error_message("Nenhum usuário encontrado", code="USERS_NOT_FOUND", status_code=404)

        cargo = db.query(Cargo).filter(Cargo.nome.ilike(f"%{cargo}%")).first()
        current_user = db.query(User).filter(User.id == current_user['user_id']).first()

        if cargo is None:
            return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)

        if(not current_user.cargo_id):
            return error_message("O usuário não tem um cargo atribuído", code="ROLE_NOT_FOUND", status_code=404)

        print(f"Cargo do usuário: {current_user.cargo_id}, Cargo requerido: {cargo.id}")
        if(current_user.cargo_id != cargo.id):
            return error_message("O usuário não tem permissão para acessar esta funcionalidade", code="FORBIDDEN", status_code=403)

        return success_message("Usuário tem permissão para acessar esta funcionalidade", data={"user_id": current_user.id, "cargo": cargo.nome})

    return role_checker


def role_create_service(cargo_name: str, db: Session):
    if not cargo_name:
        return error_message("O nome do cargo é obrigatório", code="MISSING_FIELDS", status_code=422)

    existing_cargo = db.query(Cargo).filter(Cargo.nome == cargo_name).first()
    if existing_cargo:
        return error_message("Cargo já existe", code="ROLE_ALREADY_EXISTS", status_code=400)

    new_cargo = Cargo(nome=cargo_name)
    db.add(new_cargo)
    db.commit()
    db.refresh(new_cargo)
    return success_message("Cargo criado com sucesso", data={"id": new_cargo.id, "nome": new_cargo.nome, "ativo": new_cargo.ativo})

def role_update_service(role_id: int, cargo_name: str, db: Session):
    cargo = db.query(Cargo).filter(Cargo.id == role_id).first()
    if not cargo:
        return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)
   
    if not cargo_name:
        return error_message("O nome do cargo é obrigatório", code="MISSING_FIELDS", status_code=422)

    existing_cargo = db.query(Cargo).filter(Cargo.nome == cargo_name).first()
    if existing_cargo:
        return error_message("Cargo já existe", code="ROLE_ALREADY_EXISTS", status_code=400)

    cargo.nome = cargo_name
    cargo.ativo = True
    db.commit()
    db.refresh(cargo)

    return success_message("Cargo atualizado com sucesso", data={"id": cargo.id, "nome": cargo.nome, "ativo": cargo.ativo})

def role_delete_service(role_id: int, db: Session):
    cargo = db.query(Cargo).filter(Cargo.id == role_id).first()
    if not cargo:
        return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)
   
    cargo.ativo = False
    db.commit()
    db.refresh(cargo)

    return success_message("Cargo desativado com sucesso", data={"id": cargo.id, "nome": cargo.nome, "ativo": cargo.ativo})

def role_list_service(db: Session):
    cargos = db.query(Cargo).filter(Cargo.ativo == True).all()
    cargos_data = [{"id": cargo.id, "nome": cargo.nome, "ativo": cargo.ativo} for cargo in cargos]
    return success_message("Cargos listados com sucesso", data=cargos_data)