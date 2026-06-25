from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role_id: int = Field(gt=0)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=255)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=72)
    role_id: int | None = Field(default=None, gt=0)
