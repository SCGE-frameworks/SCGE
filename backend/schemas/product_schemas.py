from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=255)
    codigo: str = Field(min_length=1, max_length=255)
    quantidade: float = Field(ge=0)
    unid_medida: str = Field(min_length=1, max_length=50)
    estoque_minimo: int = Field(ge=0)
    categoria_id: int
    ativo: bool = True


class ProductUpdate(BaseModel):
    nome: Optional[str] = Field(default=None, min_length=1, max_length=255)
    codigo: Optional[str] = Field(default=None, min_length=1, max_length=255)
    quantidade: Optional[float] = Field(default=None, ge=0)
    unid_medida: Optional[str] = Field(default=None, min_length=1, max_length=50)
    estoque_minimo: Optional[int] = Field(default=None, ge=0)
    categoria_id: Optional[int] = None
    ativo: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    nome: str
    codigo: str
    quantidade: float
    unid_medida: str
    estoque_minimo: int
    ativo: bool
    categoria_id: int
    data_cadastro: datetime

    model_config = ConfigDict(from_attributes=True)
