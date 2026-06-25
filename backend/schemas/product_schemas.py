from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    code: str = Field(min_length=1, max_length=255)
    quantity: float = Field(ge=0)
    unit_of_measure: str = Field(min_length=1, max_length=50)
    minimum_stock: int = Field(ge=0)
    category_id: int = Field(gt=0)
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    code: str | None = Field(default=None, min_length=1, max_length=255)
    quantity: float | None = Field(default=None, ge=0)
    unit_of_measure: str | None = Field(default=None, min_length=1, max_length=50)
    minimum_stock: int | None = Field(default=None, ge=0)
    category_id: int | None = Field(default=None, gt=0)
    is_active: bool | None = None
