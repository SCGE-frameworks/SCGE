from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    email: EmailStr
    senha: str = Field(min_length=8)
 
class UserUpdate(BaseModel):
    nome: Optional[str] = Field(min_length=3, max_length=255)
    email: Optional[EmailStr]
    senha: Optional[str] = Field(min_length=8)

class UserResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)