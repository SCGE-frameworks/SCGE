from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from database import Base


class Product(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, )
    codigo = Column(String, )
    quantidade = Column(Float, )
    unid_medida = Column(String, )
    estoque_minimo = Column(Integer, )
    ativo = Column(Boolean, default=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    data_cadastro = Column(DateTime, default=lambda: datetime.now(timezone.utc))