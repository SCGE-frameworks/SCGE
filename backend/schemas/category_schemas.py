from pydantic import BaseModel, Field
from typing import Optional


class CategoryCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    descricao: str = Field(min_length=3, max_length=255)


class CategoryUpdate(BaseModel):
    nome: Optional[str] = Field(default=None, min_length=3, max_length=255)
    descricao: Optional[str] = Field(default=None, min_length=3, max_length=255)
