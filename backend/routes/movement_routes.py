from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.services.moviment_service import create_entry_service
from database import get_db
from schemas import MovimentCreate

router = APIRouter(prefix="/movements", tags=["Stocks Movements"])

@router.get("/")
def list_movements():
    return {"message": "Lista de movimentações de estoque"}

@router.post("/create_entry")
def create_entry(entry: MovimentCreate, db: Session = Depends(get_db)):
    return create_entry_service(entry, db)

@router.post("/create_exit")
def register_exit():
    return {"message": "Saída de estoque cadastrada com sucesso!"}

@router.get("/{movement_id}")
def get_movement_details(movement_id: int):
    return {"message": f"Detalhes da movimentação de estoque {movement_id}"}
