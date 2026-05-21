from sqlalchemy import Boolean, Column, Integer, String
from database import Base


class Category(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, unique=True)
    descricao = Column(String)
    ativo = Column(Boolean, default=True, nullable=False)
