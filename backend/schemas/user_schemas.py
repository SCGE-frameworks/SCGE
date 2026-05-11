from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UserResponse(BaseModel):
    id: int
    nome: str
    email: str

    model_config = ConfigDict(from_attributes=True)