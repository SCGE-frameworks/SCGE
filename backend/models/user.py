from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    def to_dict(
        self,
        role_name: str | None = None,
        access_level: int | None = None,
    ) -> dict:
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_active": self.is_active,
            "role_id": self.role_id,
        }
        if role_name is not None:
            data["role_name"] = role_name
        if access_level is not None:
            data["access_level"] = access_level
        return data
