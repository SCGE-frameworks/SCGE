from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from models import AccessLevels, User
from database import get_db
from core import require_min_access_level, get_current_user
from schemas import MovementCreate
from services import (
    create_entry_service,
    create_exit_service,
    create_loss_service,
    get_movement_by_id_service,
    list_movements_service,
)

router = APIRouter(prefix="/movements", tags=["Movements"], dependencies=[Depends(get_current_user)])


@router.get("/")
def list_movements(db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER))):
    return list_movements_service(db)


@router.get("/{movement_id}")
def get_movement_by_id(movement_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_min_access_level(AccessLevels.VIEWER))):
    return get_movement_by_id_service(movement_id, db)


@router.post("/entry")
def create_entry(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_access_level(AccessLevels.OPERATOR)),
):
    return create_entry_service(payload, db, current_user.id)


@router.post("/exit")
def create_exit(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_access_level(AccessLevels.OPERATOR)),
):
    return create_exit_service(payload, db, current_user.id)


@router.post("/loss")
def create_loss(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_access_level(AccessLevels.OPERATOR)),
):
    return create_loss_service(payload, db, current_user.id)
