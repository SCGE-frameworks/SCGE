from fastapi import APIRouter, Depends
from models import Product
from core import get_current_user, success_message
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/reports", tags=["Reports"], dependencies=[Depends(get_current_user)])

@router.get("/low-stock")
def get_low_stock_report(db: Session = Depends(get_db)):

    low_stock_products = db.query(Product).filter(Product.is_active == True, Product.quantity <= Product.minimum_stock).all()

    return success_message(
        "",
        data={"products": [product.to_dict() for product in low_stock_products]}
    )