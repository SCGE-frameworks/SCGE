from sqlalchemy import Column, Integer, String
from database import Base


class Category(Base):

    __tablename__ = "categorias"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    nome = Column(String, nullable=False)