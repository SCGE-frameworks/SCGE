from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=255)
    email: EmailStr
    senha: str = Field(min_length=8, max_length=72)
    cargo_id: int
 
class UserUpdate(BaseModel):
    nome: Optional[str] = Field(min_length=3, max_length=255)
    email: Optional[EmailStr]
    senha: Optional[str] = Field(min_length=8, max_length=72)