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

    db.add(new_entry, product)
    db.commit()
    db.refresh(new_entry, product)

    return success_message(
        "Entrada registrada com sucesso",
         data={"moviment": new_entry, "product": product}
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

    db.add(product, new_moviment)
    db.commit()
    db.refresh(product, new_moviment)

    return success_message(
        "Saída registrada com sucesso",
         data={"moviment": new_moviment, "product": product}
    )

