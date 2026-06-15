from pydantic import BaseModel, EmailStr, Field

class AuthRequest(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=8)

