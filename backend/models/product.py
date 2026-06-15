from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from database import Base


class Product(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False, unique=True)
    codigo = Column(String, nullable=False, unique=True)
    quantidade = Column(Float, nullable=False)
    unid_medida = Column(String, nullable=False)
    estoque_minimo = Column(Integer, nullable=False)
    ativo = Column(Boolean, default=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    data_cadastro = Column(DateTime, default=lambda: datetime.now(timezone.utc))