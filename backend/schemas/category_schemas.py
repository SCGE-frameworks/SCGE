from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class CategoryCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    descricao: str = Field(min_length=3, max_length=255)


class CategoryUpdate(BaseModel):
    nome: Optional[str] = Field(default=None, min_length=3, max_length=255)
    descricao: Optional[str] = Field(default=None, min_length=3, max_length=255)


class CategoryResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    ativo: bool
    model_config = ConfigDict(from_attributes=True)
