from sqlalchemy.orm import Session

from core import error_message, success_message
from models import Category, Product
from schemas import CategoryCreate, CategoryUpdate


def create_category_service(category: CategoryCreate, db: Session):
    existing = db.query(Category).filter(Category.name == category.name).first()

    if existing:
        if existing.is_active:
            return error_message("Category already exists", code="CATEGORY_IN_USE", status_code=400)

        existing.is_active = True
        existing.description = category.description
        db.commit()
        db.refresh(existing)
        return success_message("Category reactivated successfully", data={"category": existing.to_dict()})

    new_category = Category(
        name=category.name,
        description=category.description,
        is_active=True,
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return success_message("Category created successfully", data={"category": new_category.to_dict()})


def list_categories_service(db: Session):
    categories = db.query(Category).filter(Category.is_active.is_(True)).all()
    message = "Categories retrieved successfully" if categories else "No categories found"

    return success_message(
        message,
        data={"categories": [category.to_dict() for category in categories]},
    )


def get_category_by_id_service(category_id: int, db: Session):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        return error_message("Category not found", code="CATEGORY_NOT_FOUND", status_code=404)

    if not category.is_active:
        return error_message("Category is inactive", code="CATEGORY_INACTIVE", status_code=404)

    return success_message("Category retrieved successfully", data={"category": category.to_dict()})


def update_category_service(category_id: int, category_data: CategoryUpdate, db: Session):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        return error_message("Category not found", code="CATEGORY_NOT_FOUND", status_code=404)

    if not category.is_active:
        return error_message("Category is inactive", code="CATEGORY_INACTIVE", status_code=400)

    if category_data.name is None and category_data.description is None:
        return error_message("No update data provided", code="NO_UPDATE_DATA", status_code=422)

    if category_data.name is not None:
        name_taken = (
            db.query(Category)
            .filter(
                Category.name == category_data.name,
                Category.id != category_id,
                Category.is_active.is_(True),
            )
            .first()
        )
        if name_taken:
            return error_message("Category already exists", code="CATEGORY_IN_USE", status_code=400)
        category.name = category_data.name

    if category_data.description is not None:
        category.description = category_data.description

    db.commit()
    db.refresh(category)

    return success_message("Category updated successfully", data={"category": category.to_dict()})


def delete_category_service(category_id: int, db: Session):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        return error_message("Category not found", code="CATEGORY_NOT_FOUND", status_code=404)

    if not category.is_active:
        return error_message("Category is already inactive", code="CATEGORY_ALREADY_INACTIVE", status_code=400)

    active_products = (
        db.query(Product)
        .filter(Product.is_active.is_(True), Product.category_id == category.id)
        .count()
    )

    if active_products > 0:
        return error_message("Category can't be deactivated because it has active products", code="CATEGORY_HAS_PRODUCTS", status_code=400)

    category.is_active = False
    db.commit()
    db.refresh(category)

    return success_message("Category deactivated successfully", data={"category": category.to_dict()})
