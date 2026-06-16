from sqlalchemy.orm import Session

from core import error_message, success_message
from models import Category, Product
from schemas import ProductCreate, ProductUpdate


def create_product_service(product: ProductCreate, db: Session):
    if not db.query(Category).filter(Category.id == product.category_id, Category.is_active.is_(True)).first():
        return error_message("Invalid category", code="INVALID_CATEGORY", status_code=400)

    if db.query(Product).filter(Product.code == product.code).first():
        return error_message("Product code already exists", code="CODE_IN_USE", status_code=400)

    new_product = Product(
        name=product.name,
        code=product.code,
        quantity=product.quantity,
        unit_of_measure=product.unit_of_measure,
        minimum_stock=product.minimum_stock,
        category_id=product.category_id,
        is_active=product.is_active,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return success_message("Product created successfully", data=new_product.to_dict())


def update_product_service(product_id: int, product_data: ProductUpdate, db: Session):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return error_message("Product not found", code="PRODUCT_NOT_FOUND", status_code=404)

    if not product.is_active:
        return error_message("Product is inactive", code="PRODUCT_INACTIVE", status_code=400)

    if all(
        value is None
        for value in (
            product_data.name,
            product_data.code,
            product_data.quantity,
            product_data.unit_of_measure,
            product_data.minimum_stock,
            product_data.category_id,
            product_data.is_active,
        )
    ):
        return error_message("No update data provided", code="NO_UPDATE_DATA", status_code=422)

    if product_data.category_id is not None:
        if not db.query(Category).filter(Category.id == product_data.category_id, Category.is_active.is_(True)).first():
            return error_message("Invalid category", code="INVALID_CATEGORY", status_code=400)
        product.category_id = product_data.category_id

    if product_data.code is not None and product_data.code != product.code:
        if db.query(Product).filter(Product.code == product_data.code, Product.id != product_id).first():
            return error_message("Product code already exists", code="CODE_IN_USE", status_code=400)
        product.code = product_data.code

    if product_data.name is not None:
        product.name = product_data.name
    if product_data.quantity is not None:
        product.quantity = product_data.quantity
    if product_data.unit_of_measure is not None:
        product.unit_of_measure = product_data.unit_of_measure
    if product_data.minimum_stock is not None:
        product.minimum_stock = product_data.minimum_stock
    if product_data.is_active is not None:
        product.is_active = product_data.is_active

    db.commit()
    db.refresh(product)

    return success_message("Product updated successfully", data=product.to_dict())


def delete_product_service(product_id: int, db: Session):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return error_message("Product not found", code="PRODUCT_NOT_FOUND", status_code=404)

    if not product.is_active:
        return error_message("Product is already inactive", code="PRODUCT_INACTIVE", status_code=400)

    product.is_active = False
    db.commit()
    db.refresh(product)

    return success_message("Product deactivated successfully", data=product.to_dict())


def list_products_service(
    db: Session,
    name: str | None = None,
    code: str | None = None,
    category_id: int | None = None,
):
    query = db.query(Product).filter(Product.is_active.is_(True))

    if name:
        query = query.filter(Product.name.ilike(f"%{name}%"))
    if code:
        query = query.filter(Product.code.ilike(f"%{code}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)

    products = query.all()

    return success_message(
        "Products retrieved successfully",
        data={"products": [product.to_dict() for product in products]},
    )


def get_product_by_id_service(product_id: int, db: Session):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product or not product.is_active:
        return error_message("Product not found", code="PRODUCT_NOT_FOUND", status_code=404)

    return success_message("Product retrieved successfully", data=product.to_dict())
