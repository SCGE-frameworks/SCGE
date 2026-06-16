from fastapi import Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Role, User
from schemas import RoleCreate
from core import error_message, get_current_user, success_message


def require_role(role_name: str = None):

    def role_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
        role_name=role_name,
    ):

        if role_name is None:
            return error_message("É preciso especificar um cargo", code="ROLE_NOT_FOUND", status_code=404)

        if not current_user:
            return error_message("Nenhum usuário encontrado", code="USERS_NOT_FOUND", status_code=404)

        role = db.query(Role).filter(Role.nome.ilike(f"%{role_name}%")).first()
        current_user = db.query(User).filter(User.id == current_user["user_id"]).first()

        if role is None:
            return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)

        if not current_user.cargo_id:
            return error_message("O usuário não tem um cargo atribuído", code="ROLE_NOT_FOUND", status_code=404)

        if current_user.cargo_id != role.id:
            return error_message("O usuário não tem permissão para acessar esta funcionalidade", code="FORBIDDEN", status_code=403)

        return success_message(
            "Usuário tem permissão para acessar esta funcionalidade",
            data={"user_id": current_user.id, "cargo": role.nome},
        )

    return role_checker


def role_create_service(role_data: RoleCreate, db: Session):
    if not role_data.nome:
        return error_message("O nome do cargo é obrigatório", code="MISSING_FIELDS", status_code=422)

    existing_role = db.query(Role).filter(Role.nome == role_data.nome).first()
    if existing_role:
        return error_message("Cargo já existe", code="ROLE_ALREADY_EXISTS", status_code=400)

    new_role = Role(nome=role_data.nome, ativo=role_data.ativo)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return success_message(
        "Cargo criado com sucesso",
        data={"id": new_role.id, "nome": new_role.nome, "ativo": new_role.ativo},
    )


def role_update_service(role_id: int, role_data: RoleCreate, db: Session):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)

    if not role_data.nome:
        return error_message("O nome do cargo é obrigatório", code="MISSING_FIELDS", status_code=422)

    existing_role = (
        db.query(Role)
        .filter(Role.nome == role_data.nome, Role.id != role_id)
        .first()
    )
    if existing_role:
        return error_message("Cargo já existe", code="ROLE_ALREADY_EXISTS", status_code=400)

    role.nome = role_data.nome
    role.ativo = role_data.ativo
    db.commit()
    db.refresh(role)

    return success_message(
        "Cargo atualizado com sucesso",
        data={"id": role.id, "nome": role.nome, "ativo": role.ativo},
    )


def role_delete_service(role_id: int, db: Session):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return error_message("Cargo não encontrado", code="ROLE_NOT_FOUND", status_code=404)

    if not role.ativo:
        return error_message("Cargo já está desativado", code="ROLE_ALREADY_INACTIVE", status_code=400)

    role.ativo = False
    db.commit()
    db.refresh(role)

    return success_message(
        "Cargo desativado com sucesso",
        data={"id": role.id, "nome": role.nome, "ativo": role.ativo},
    )


def role_list_service(db: Session):
    roles = db.query(Role).filter(Role.ativo.is_(True)).all()
    roles_data = [{"id": role.id, "nome": role.nome, "ativo": role.ativo} for role in roles]
    return success_message("Cargos listados com sucesso", data=roles_data)
