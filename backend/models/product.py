from sqlalchemy import Boolean, Column, Float, Integer, String
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    codigo = Column(String, nullable=False)
    quantidade = Column(Float, nullable=False)
    unid_medida = Column(String, nullable=False)  # Representando o Enum como String conforme a imagem
    estoque_minimo = Column(Integer, nullable=False)
    ativo = Column(Boolean, default=True)
    categoria_id = Column(Integer, nullable=False)
    data_cadastro = Column(DateTime, default=datetime.utcnow)