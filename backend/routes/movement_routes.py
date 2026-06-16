from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core import get_current_user
from database import get_db
from schemas import MovementCreate
from services import (
    create_entry_service,
    create_exit_service,
    create_loss_service,
    get_movement_by_id_service,
    list_movements_service,
)

router = APIRouter(prefix="/movements", tags=["Movements"])


@router.get("/")
def list_movements(db: Session = Depends(get_db)):
    return list_movements_service(db)


@router.get("/{movement_id}")
def get_movement(movement_id: int, db: Session = Depends(get_db)):
    return get_movement_by_id_service(movement_id, db)


@router.post("/entry")
def create_entry(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return create_entry_service(payload, db, int(current_user["user_id"]))


@router.post("/exit")
def create_exit(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return create_exit_service(payload, db, int(current_user["user_id"]))


@router.post("/loss")
def create_loss(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return create_loss_service(payload, db, int(current_user["user_id"]))
