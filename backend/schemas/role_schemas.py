from pydantic import BaseModel, Field

from models import AccessLevels

class RoleCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    access_level: AccessLevels = Field(gt=0, lt=5)
    is_active: bool = True
