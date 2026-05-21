from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.product import Product

def get_products(db: Session):
    return db.query(Product).filter(Product.is_active == True).all()


def update_product(db: Session, product_id: int, data: dict):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if "sku" in data:
        sku_exists = (
            db.query(Product)
            .filter(Product.sku == data["sku"], Product.id != product_id)
            .first()
        )

        if sku_exists:
            raise HTTPException(status_code=400, detail="SKU já cadastrado")

    for field, value in data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product

def delete_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    product.is_active = False

    db.commit()

    return {"message": "Produto desativado com sucesso"}