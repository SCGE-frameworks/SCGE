from sqlalchemy.orm import Session
from schemas.categoria_schemas import CategoriaCreate, CategoriaUpdate
from models.categoria import Categoria
from utils.responses import error_message, success_message


def create_categoria_service(categoria: CategoriaCreate, db: Session):
    nome = categoria.nome
    descricao = categoria.descricao
    if not nome or not descricao:
        return error_message(
            "nome e descricao sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    categoria_existing = db.query(Categoria).filter(Categoria.nome == nome).first()
    if categoria_existing:
        return error_message("Categoria ja cadastrada", code="CATEGORIA_IN_USE", status_code=400)

    new_categoria = Categoria(nome=nome, descricao=descricao)
    db.add(new_categoria)
    db.commit()
    db.refresh(new_categoria)

    return success_message(
        "Categoria cadastrada com sucesso",
        {"id": new_categoria.id, "nome": new_categoria.nome, "descricao": new_categoria.descricao}
    )

def get_categoria_service(category_id: int, db: Session):
    if category_id == -1:
        categorias = db.query(Categoria).all()
        return success_message(
            "Lista de categorias",
            [{"id": c.id, "nome": c.nome, "descricao": c.descricao} for c in categorias]
        )
    
    categoria = db.query(Categoria).filter(Categoria.id == category_id).first()
    if not categoria:
        return error_message("Categoria nao encontrada", code="CATEGORIA_NOT_FOUND", status_code=404)
    return success_message(
        "Detalhes da categoria",
        {"id": categoria.id, "nome": categoria.nome, "descricao": categoria.descricao}
    )
    
def update_categoria_service(category_id: int, categoria_data: CategoriaUpdate, db: Session):
    categoria = db.query(Categoria).filter(Categoria.id == category_id).first()
    if not categoria:
        return error_message("Categoria nao encontrada", code="CATEGORIA_NOT_FOUND", status_code=404)

    if not categoria_data.nome and not categoria_data.descricao:
        return error_message("Nenhuma informacao fornecida para atualizacao", code="NO_UPDATE_DATA", status_code=422)

    if categoria_data.nome is not None:
        categoria.nome = categoria_data.nome
    if categoria_data.descricao is not None:
        categoria.descricao = categoria_data.descricao
    
    db.commit()
    db.refresh(categoria)

    return success_message(
        "Categoria atualizada com sucesso",
        {"id": categoria.id, "nome": categoria.nome, "descricao": categoria.descricao}
    )
    
def delete_categoria_service(category_id: int, db: Session):
    categoria = db.query(Categoria).filter(Categoria.id == category_id).first()
    if not categoria:
        return error_message("Categoria nao encontrada", code="CATEGORIA_NOT_FOUND", status_code=404)

    categoria.ativo = False
    db.commit()
    db.refresh(categoria)
    return success_message(
        "Categoria excluida com sucesso",
        {"id": categoria.id, "nome": categoria.nome, "descricao": categoria.descricao}
    )