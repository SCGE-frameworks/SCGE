import enum

from sqlalchemy import Column, DateTime, Enum as SqlEnum, Float, ForeignKey, Integer, String

from database import Base


class MovimentType(str, enum.Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"
    PERDA = "perda"


class Moviment(Base):
    __tablename__ = "movimentacao_estoque"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo = Column(SqlEnum(MovimentType), nullable=False)
    quantidade = Column(Float, nullable=False)
    data_movimentacao = Column(DateTime, nullable=False)
    observacao = Column(String, nullable=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)