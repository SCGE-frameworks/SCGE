from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class ProductCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    descricao: Optional[str] = None
    preco: float = Field(gt=0)
    estoque: int = Field(ge=0)
    # categoria_id: int  # reativar quando categorias estiverem implementadas


class ProductResponse(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    preco: float
    estoque: int
    # categoria_id: int  # reativar quando categorias estiverem implementadas

    model_config = ConfigDict(from_attributes=True)
