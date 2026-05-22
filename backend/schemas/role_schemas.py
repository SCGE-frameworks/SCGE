from typing import Optional
from pydantic import BaseModel, Field


class RoleCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    ativo: Optional[int] = Field(default=1)