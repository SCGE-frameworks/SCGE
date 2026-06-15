from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import MovimentCreate
from services import (
    create_entry_service,
    create_exit_service,
    create_loss_service,
    get_movement_by_id_service,
    list_movements_service,
)

router = APIRouter(prefix="/movements", tags=["Stocks Movements"])


@router.get("/")
def list_movements(db: Session = Depends(get_db)):
    return list_movements_service(db)


@router.get("/{movement_id}")
def get_movement_by_id(movement_id: int, db: Session = Depends(get_db)):
    return get_movement_by_id_service(movement_id, db)


@router.post("/create_entry")
def create_entry(entry: MovimentCreate, db: Session = Depends(get_db)):
    return create_entry_service(entry, db)


@router.post("/create_exit")
def create_exit(exit: MovimentCreate, db: Session = Depends(get_db)):
    return create_exit_service(exit, db)


@router.post("/create_loss")
def create_loss(loss: MovimentCreate, db: Session = Depends(get_db)):
    return create_loss_service(loss, db)
