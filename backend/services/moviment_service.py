from datetime import datetime, timezone
from sqlalchemy.orm import Session
from schemas.moviment_schemas import MovimentCreate
from models import Moviment, Product
from utils.responses import error_message, success_message

def create_entry_service(entry: MovimentCreate, db: Session):

    product = db.query(Product).filter(Product.id == entry.product_id).first()
    if not product:
        return error_message("Produto não encontrado", code="PRODUCT_NOT_FOUND", status_code=404)

    new_entry = Moviment(
        tipo = entry.tipo,
        quantidade = entry.quantidade,
        data_movimentacao = datetime.now(timezone.utc),
        observacao = entry.observacao,
        produto_id = product.id
        # usuario_id = Usar current user ID
    )

    product.quantidade += entry.quantidade

    try:
        db.add(new_entry)          # só o objeto novo
        db.commit()
        db.refresh(new_entry)
        db.refresh(product)
    except Exception:
        db.rollback()
        return error_message(
            "Erro ao registrar entrada",
            code="MOVEMENT_CREATE_FAILED",
            status_code=500,
        )
    return success_message(
        "Entrada registrada com sucesso",
        data={
            "moviment_id": new_entry.id,
            "produto_id": product.id,
            "quantidade_atual": product.quantidade,
        },
    )

def create_exit_service(exit: MovimentCreate, db: Session):
    
    product = db.query(Product).filter(Product.id == exit.produto_id).first()
    if not product:
        return error_message("Produto não encontrado", code="PRODUCT_NOT_FOUND", status_code=404)
    
    if exit.quantidade > product.quantidade:
        return error_message("Quantidade insuficiente em estoque", code="INSUFFICIENT_STOCK", status_code=400)

    new_moviment = Moviment(
        tipo = exit.tipo,
        quantidade = exit.quantidade,
        data_movimentacao = datetime.now(timezone.utc),
        observacao = exit.observacao,
        produto_id = product.id
        # usuario_id = (pegar pelo get_current_user)
    )

    product.quantidade -= exit.quantidade

    try:
        db.add(new_moviment)
        db.commit()
        db.refresh(new_moviment)
        db.refresh(product)
    except:
        db.rollback()
        return error_message(
            "Erro ao registrar saída",
            code="MOVEMENT_CREATE_FAILED",
            status_code=500,
        )

    return success_message(
        "Saída registrada com sucesso",
        data={
            "moviment_id": new_moviment.id,
            "produto_id": product.id,
            "quantidade_atual": product.quantidade,
        },
    )

def create_loss_service(loss: MovimentCreate, db: Session):
    
    product = db.query(Product).filter(Product.id == loss.produto_id).first()
    if not product:
        return error_message("Produto não encontrado", code="PRODUCT_NOT_FOUND", status_code=404)
    
    new_moviment = Moviment(
        tipo = loss.tipo,
        quantidade = loss.quantidade,
        data_movimentacao = datetime.now(timezone.utc),
        observacao = loss.observacao,
        produto_id = product.id
        # usuario_id = (pegar pelo get_current_user)
    )

    product.quantidade -= loss.quantidade

    try:
        db.add(new_moviment)
        db.commit()
        db.refresh(new_moviment)
        db.refresh(product)
    except:
        db.rollback()
        return error_message(
            "Erro ao registrar perda",
            code="MOVEMENT_CREATE_FAILED",
            status_code=500,
        )

    return success_message(
        "Perda registrada com sucesso",
        data={
            "moviment_id": new_moviment.id,
            "produto_id": product.id,
            "quantidade_atual": product.quantidade,
        },
    )