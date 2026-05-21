from sqlalchemy.orm import Session
from schemas.product_schemas import ProductCreate
from models.product import Product
from utils.responses import error_message, success_message

def create_product_service(product: ProductCreate, db: Session):

    nome = product.nome
    preco = product.preco
    if not nome or not preco:
        return error_message(
            "nome e preco sao obrigatorios", code="MISSING_FIELDS", status_code=422
        )

    # Validação de categoria — reativar quando categorias estiverem implementadas:
    # from models.category import Category
    # categoria_id = product.categoria_id
    # category_existing = db.query(Category).filter(Category.id == categoria_id).first()
    # if not category_existing:
    #     return error_message(
    #         "Categoria invalida", code="INVALID_CATEGORY", status_code=400
    #     )

    new_product = Product(
        nome=product.nome,
        descricao=product.descricao,
        preco=product.preco,
        estoque=product.estoque,
        # categoria_id=product.categoria_id,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return success_message(
        "Produto cadastrado com sucesso",
        {
            "id": new_product.id,
            "nome": new_product.nome,
            "descricao": new_product.descricao,
            "preco": new_product.preco,
            "estoque": new_product.estoque,
            # "categoria_id": new_product.categoria_id,
        },
    )
