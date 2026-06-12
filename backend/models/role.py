from sqlalchemy import Boolean, Column, Integer, String
from database import Base


class Role(Base):
    __tablename__ = "cargos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
    ativo = Column(Boolean, default=True)
