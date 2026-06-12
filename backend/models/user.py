from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
    email = Column(String)
    senha = Column(String)
    ativo = Column(Boolean, default=True)
    cargo_id = Column(Integer, ForeignKey("cargos.id"))
