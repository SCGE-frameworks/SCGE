from pydantic import BaseModel, Field
from typing import Optional

from models.moviment import MovimentType 

class MovimentCreate(BaseModel):
    tipo: MovimentType
    quantidade: float = Field(gt=0)
    observacao: Optional[str] = Field(default=None, max_length=500)
    produto_id: int = Field(gt=0)