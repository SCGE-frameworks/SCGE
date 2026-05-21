from sqlalchemy import ( Column,Integer,String,Float,ForeignKey)
from database import Base
class Product(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    descricao = Column(String)
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, default=0)
    # categoria_id = Column(Integer, ForeignKey("categorias.id"))