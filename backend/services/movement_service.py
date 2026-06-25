from datetime import datetime, timezone

from sqlalchemy.orm import Session

from core import error_message, success_message
from models import Movement, MovementType, Product
from schemas import MovementCreate


def list_movements_service(db: Session):
    movements = db.query(Movement).order_by(Movement.movement_date.desc()).all()

    return success_message(
        "Movements retrieved successfully",
        data={"movements": [movement.to_dict() for movement in movements]},
    )


def get_movement_by_id_service(movement_id: int, db: Session):
    movement = db.query(Movement).filter(Movement.id == movement_id).first()

    if not movement:
        return error_message("Movement not found", code="MOVEMENT_NOT_FOUND", status_code=404)

    return success_message("Movement retrieved successfully", data={"movement": movement.to_dict()})


def _get_active_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active.is_(True)).first()

    if not product:
        return None, error_message("Product not found", code="PRODUCT_NOT_FOUND", status_code=404)

    return product, None


def _create_movement(
    db: Session,
    movement_type: MovementType,
    payload: MovementCreate,
    user_id: int,
):
    product, error = _get_active_product(db, payload.product_id)
    if error:
        return error

    if movement_type in (MovementType.EXIT, MovementType.LOSS):
        if payload.quantity > product.quantity:
            return error_message("Insufficient stock", code="INSUFFICIENT_STOCK", status_code=400)

    movement = Movement(
        type=movement_type,
        quantity=payload.quantity,
        movement_date=datetime.now(timezone.utc),
        notes=payload.notes,
        product_id=product.id,
        user_id=user_id,
    )

    if movement_type == MovementType.ENTRY:
        product.quantity += payload.quantity
    else:
        product.quantity -= payload.quantity

    try:
        db.add(movement)
        db.commit()
        db.refresh(movement)
        db.refresh(product)
    except Exception:
        db.rollback()
        return error_message("Failed to register movement", code="MOVEMENT_CREATE_FAILED", status_code=500)

    return success_message(
        "Movement registered successfully",
        data={
            "movement": movement.to_dict(),
            "product": {
                "id": product.id,
                "current_quantity": product.quantity,
                "low_stock": product.quantity <= product.minimum_stock,
            },
        },
    )


def create_entry_service(payload: MovementCreate, db: Session, user_id: int):
    return _create_movement(db, MovementType.ENTRY, payload, user_id)


def create_exit_service(payload: MovementCreate, db: Session, user_id: int):
    return _create_movement(db, MovementType.EXIT, payload, user_id)


def create_loss_service(payload: MovementCreate, db: Session, user_id: int):
    return _create_movement(db, MovementType.LOSS, payload, user_id)
