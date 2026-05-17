from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CategoriaCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    descricao: str = Field(min_length=3, max_length=255)

class CategoriaUpdate(BaseModel):
    nome: Optional[str] = Field(min_length=3, max_length=255)
    descricao: Optional[str] = Field(min_length=3, max_length=255)


class CategoriaResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    model_config = ConfigDict(from_attributes=True)