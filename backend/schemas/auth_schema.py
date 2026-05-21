from pydantic import BaseModel, EmailStr, Field

class AuthRequest(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=8)
 
class AuthResponse(BaseModel):
    token: str
    token_type: str = "bearer"

