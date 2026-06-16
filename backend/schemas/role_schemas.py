from pydantic import BaseModel, Field


class RoleCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    is_active: bool = True
