from sqlalchemy import Column, Boolean, Integer, String
from database import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, unique=True)
    descricao = Column(String, nullable=False)

