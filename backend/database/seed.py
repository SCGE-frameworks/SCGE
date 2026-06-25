from sqlalchemy.orm import Session

from core import hash_password
from models import AccessLevels, Role, User

DEFAULT_ROLES = [
    ("Administrador", AccessLevels.ADMIN),
    ("Gerente", AccessLevels.MANAGER),
    ("Operador", AccessLevels.OPERATOR),
    ("Consulta", AccessLevels.VIEWER),
]


def create_initial_seed(db: Session):
    if db.query(Role).first():
        return

    roles_by_name = {}
    for name, access_level in DEFAULT_ROLES:
        role = Role(name=name, access_level=access_level)
        db.add(role)
        roles_by_name[name] = role

    db.flush()

    user_admin = User(
        name="Administrador",
        email="admin@scge.com",
        password_hash=hash_password("admin@123"),
        role_id=roles_by_name["Administrador"].id,
    )
    db.add(user_admin)
    db.commit()
