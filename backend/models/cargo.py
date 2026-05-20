from sqlalchemy import Column, Integer, String
from database import Base

class Cargo(Base):
    __tablename__ = "cargos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
