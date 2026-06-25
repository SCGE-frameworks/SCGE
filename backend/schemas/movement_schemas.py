from pydantic import BaseModel, Field


class MovementCreate(BaseModel):
    quantity: float = Field(gt=0)
    notes: str | None = Field(default=None, max_length=500)
    product_id: int = Field(gt=0)
