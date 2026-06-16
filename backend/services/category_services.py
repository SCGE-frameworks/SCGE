from sqlalchemy.orm import Session

from models import Category
from schemas import CategoryCreate, CategoryUpdate
from core import error_message, success_message


def create_category_service(category: CategoryCreate, db: Session):

    nome = category.nome
    descricao = category.descricao
    if not nome or not descricao:
        return error_message(
            "nome e descricao sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    category_existing = db.query(Category).filter(Category.nome == nome).first()
    if category_existing:
        if category_existing.ativo:
            return error_message(
                "Categoria ja cadastrada", code="CATEGORY_IN_USE", status_code=400
            )

        category_existing.ativo = True
        category_existing.descricao = descricao

        db.commit()
        db.refresh(category_existing)

        return success_message(
            "Categoria reativada com sucesso",
            {
                "id": category_existing.id,
                "nome": category_existing.nome,
                "descricao": category_existing.descricao,
                "ativo": category_existing.ativo,
            },
        )

    new_category = Category(nome=nome, descricao=descricao, ativo=True)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return success_message(
        "Categoria cadastrada com sucesso",
        {
            "id": new_category.id,
            "nome": new_category.nome,
            "descricao": new_category.descricao,
            "ativo": new_category.ativo,
        },
    )


def list_categories_service(db: Session):

    categories = db.query(Category).filter(Category.ativo.is_(True)).all()
    categories_data = []

    for category in categories:
        categories_data.append({
            "id": category.id,
            "nome": category.nome,
            "descricao": category.descricao,
            "ativo": category.ativo,
        })
        
    message = "Lista de categorias" if categories else "Nenhuma categoria encontrada"
    return success_message(message, categories_data)


def get_category_by_id_service(category_id: int, db: Session):
    
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        return error_message(
            "Categoria nao encontrada", code="CATEGORY_NOT_FOUND", status_code=404
        )

    if not category.ativo:
        return error_message(
            "Categoria inativa", code="CATEGORY_INACTIVE", status_code=404
        )

    return success_message(
        "Detalhes da categoria",
        {
            "id": category.id,
            "nome": category.nome,
            "descricao": category.descricao,
            "ativo": category.ativo,
        },
    )


def update_category_service(category_id: int, category_data: CategoryUpdate, db: Session):

    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        return error_message(
            "Categoria nao encontrada", code="CATEGORY_NOT_FOUND", status_code=404
        )

    if not category.ativo:
        return error_message(
            "Categoria inativa", code="CATEGORY_INACTIVE", status_code=400
        )

    if not category_data.nome and not category_data.descricao:
        return error_message(
            "Nenhuma informacao fornecida para atualizacao",
            code="NO_UPDATE_DATA",
            status_code=422,
        )

    if category_data.nome is not None:
        nome_taken = (
            db.query(Category).filter(Category.nome == category_data.nome, Category.id != category_id, Category.ativo.is_(True),).first()
            )

        if nome_taken:
            return error_message(
                "Essa categoria ja existe", code="CATEGORY_IN_USE", status_code=400
            )
            
        category.nome = category_data.nome

    if category_data.descricao is not None:
        category.descricao = category_data.descricao

    db.commit()
    db.refresh(category)

    return success_message(
        "Categoria atualizada com sucesso",
        {
            "id": category.id,
            "nome": category.nome,
            "descricao": category.descricao,
            "ativo": category.ativo,
        },
    )


def delete_category_service(category_id: int, db: Session):

    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        return error_message(
            "Categoria nao encontrada", code="CATEGORY_NOT_FOUND", status_code=404
        )
    if not category.ativo:
        return error_message(
            "Categoria ja esta inativa",
            code="CATEGORY_ALREADY_INACTIVE",
            status_code=400,
        )

    category.ativo = False
    db.commit()
    db.refresh(category)

    return success_message(
        "Categoria desativada com sucesso",
        {
            "id": category.id,
            "nome": category.nome,
            "descricao": category.descricao,
            "ativo": category.ativo,
        },
    )
