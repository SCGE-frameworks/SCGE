from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String

from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    code = Column(String(255), nullable=False, unique=True)
    quantity = Column(Float, nullable=False, default=0)
    unit_of_measure = Column(String(50), nullable=False)
    minimum_stock = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "quantity": self.quantity,
            "unit_of_measure": self.unit_of_measure,
            "minimum_stock": self.minimum_stock,
            "is_active": self.is_active,
            "category_id": self.category_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "low_stock": self.quantity <= self.minimum_stock,
        }
