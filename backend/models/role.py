from sqlalchemy import Boolean, Column, Integer, String

from database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True, nullable=False)

    def to_dict(self) -> dict:
        return {"id": self.id, "name": self.name, "is_active": self.is_active}
