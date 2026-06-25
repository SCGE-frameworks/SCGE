import enum
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum as SqlEnum, Float, ForeignKey, Integer, String

from database import Base


class MovementType(str, enum.Enum):
    ENTRY = "entry"
    EXIT = "exit"
    LOSS = "loss"


class Movement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(SqlEnum(MovementType), nullable=False)
    quantity = Column(Float, nullable=False)
    movement_date = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    notes = Column(String(500), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type.value,
            "quantity": self.quantity,
            "movement_date": self.movement_date.isoformat() if self.movement_date else None,
            "notes": self.notes,
            "product_id": self.product_id,
            "user_id": self.user_id,
        }
