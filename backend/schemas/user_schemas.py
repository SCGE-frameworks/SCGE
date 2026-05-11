from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=100)
    email: EmailStr
    senha: str = Field(min_length=8)


class UserResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)