import enum
from sqlalchemy import Boolean, Column, Integer, String, Enum
from database import Base

class AccessLevels(int, enum.Enum):
    VIEWER = 1
    OPERATOR = 2
    MANAGER = 3
    ADMIN = 4

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    access_level = Column(Enum(AccessLevels), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    def to_dict(self) -> dict:
        return {"id": self.id, "name": self.name, "access_level": self.access_level.value, "is_active": self.is_active}
