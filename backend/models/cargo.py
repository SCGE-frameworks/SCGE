from sqlalchemy import Column, Integer, String
from database import Base

class Cargo(Base):
    __tablename__ = "cargo"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
