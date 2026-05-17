from pydantic import BaseModel, ConfigDict, Field, optional

class CategoriaCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    descricao: str = Field(min_length=3, max_length=255)

class CategoriaUpdate(BaseModel):
    nome: optional[str] = Field(min_length=3, max_length=255)
    descricao: optional[str] = Field(min_length=3, max_length=255)


class CategoriaResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    model_config = ConfigDict(from_attributes=True)