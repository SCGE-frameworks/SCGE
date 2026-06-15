from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Enum
from database import Base

class MovimentType(Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"
    PERDA = "perda"
    AJUSTE = "ajuste"

class Moviment(Base):
    __tablename__ = "movimentacao_estoque"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo = Column(Enum(MovimentType), nullable=False)
    quantidade = Column(Float, nullable=False)
    data_movimentacao = Column(DateTime, nullable=False)
    observacao = Column(String, nullable=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)