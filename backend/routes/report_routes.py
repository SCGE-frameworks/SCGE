from fastapi import APIRouter, Depends
from models import AccessLevels, Product, User
from core import require_min_access_level, success_message
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/reports", tags=["Reports"], dependencies=[Depends(require_min_access_level(AccessLevels.VIEWER))])

@router.get("/low-stock")
def get_low_stock_report(db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER))):

    low_stock_products = db.query(Product).filter(Product.is_active.is_(True), Product.quantity <= Product.minimum_stock).all()

    return success_message(
        "Low stock products report",
        data={"products": [product.to_dict() for product in low_stock_products]}
    )