from sqlalchemy.orm import Session

from core import hash_password, success_message
from models import AccessLevels, Role, User


def create_initial_seed(db: Session):

    roles = db.query(Role).all()
    if roles:
        return
    
    admin_role = Role(name="Administrador", access_level=AccessLevels.ADMIN)

    password_hashed = hash_password("admin@123")
    db.add(admin_role)
    db.flush()

    user_admin = User(name="Administrador", email="admin@scge.com", password_hash=password_hashed, role_id=admin_role.id)

    db.add(user_admin)
    db.commit()