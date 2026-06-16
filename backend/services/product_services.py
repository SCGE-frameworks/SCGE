from sqlalchemy.orm import Session

from models import Category, Product
from schemas import ProductCreate, ProductUpdate
from core import error_message, success_message

def create_product_service(product: ProductCreate, db: Session):
    category_existing = (
        db.query(Category).filter(Category.id == product.categoria_id).first()
    )
    if not category_existing:
        return error_message(
            "Categoria invalida", code="INVALID_CATEGORY", status_code=400
        )

    new_product = Product(
        nome=product.nome,
        codigo=product.codigo,
        quantidade=product.quantidade,
        unid_medida=product.unid_medida,
        estoque_minimo=product.estoque_minimo,
        categoria_id=product.categoria_id,
        ativo=product.ativo,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return success_message(
        "Produto cadastrado com sucesso",
        {
            "id": new_product.id,
            "nome": new_product.nome,
            "codigo": new_product.codigo,
            "quantidade": new_product.quantidade,
            "unid_medida": new_product.unid_medida,
            "estoque_minimo": new_product.estoque_minimo,
            "ativo": new_product.ativo,
            "categoria_id": new_product.categoria_id,
            "data_cadastro": new_product.data_cadastro,
        },
    )

def update_product_service(product_id: int, product_data: ProductUpdate, db: Session):

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return error_message(
            "Produto não encontrado", code="PRODUCT_NOT_FOUND", status_code=404
        )

    if not product.ativo:
        return error_message(
            "Produto inativo", code="PRODUCT_INACTIVE", status_code=400
        )

    if (
        product_data.nome is None
        and product_data.codigo is None
        and product_data.quantidade is None
        and product_data.unid_medida is None
        and product_data.estoque_minimo is None
        and product_data.categoria_id is None
        and product_data.ativo is None
    ):
        return error_message(
            "Nenhuma informacao fornecida para atualizacao",
            code="NO_UPDATE_DATA",
            status_code=422,
        )

    if product_data.categoria_id is not None:
        category_existing = (
            db.query(Category)
            .filter(Category.id == product_data.categoria_id)
            .first()
        )
        if not category_existing:
            return error_message(
                "Categoria invalida", code="INVALID_CATEGORY", status_code=400
            )
        product.categoria_id = product_data.categoria_id

    if product_data.nome is not None:
        product.nome = product_data.nome
    if product_data.codigo is not None:
        product.codigo = product_data.codigo
    if product_data.quantidade is not None:
        product.quantidade = product_data.quantidade
    if product_data.unid_medida is not None:
        product.unid_medida = product_data.unid_medida
    if product_data.estoque_minimo is not None:
        product.estoque_minimo = product_data.estoque_minimo
    if product_data.ativo is not None:
        product.ativo = product_data.ativo

    db.commit()
    db.refresh(product)

    return success_message(
        "Produto atualizado com sucesso",
        {
            "id": product.id,
            "nome": product.nome,
            "codigo": product.codigo,
            "quantidade": product.quantidade,
            "unid_medida": product.unid_medida,
            "estoque_minimo": product.estoque_minimo,
            "ativo": product.ativo,
            "categoria_id": product.categoria_id,
            "data_cadastro": product.data_cadastro,
        },
    )

def delete_product_service(product_id: int, db: Session):

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return error_message(
            "Produto não encontrado", code="PRODUCT_NOT_FOUND", status_code=404
        )

    if not product.ativo:
        return error_message(
            "Esse produto já está inativo", code="PRODUCT_INACTIVE"
        )
    
    product.ativo = False

    db.add(product)
    db.commit()
    db.refresh(product)
    
    return success_message(
        "Produto excluído com sucesso",
        {
            "id": product.id,
            "nome": product.nome,
            "codigo": product.codigo,
            "quantidade": product.quantidade,
            "unid_medida": product.unid_medida,
            "estoque_minimo": product.estoque_minimo,
            "ativo": product.ativo,
            "categoria_id": product.categoria_id,
            "data_cadastro": product.data_cadastro,
        }
    )


def list_products_service(
    db: Session, 
    nome: str = None, 
    codigo: str = None, 
    categoria_id: int = None
):
    query = db.query(Product)

    if nome:
        query = query.filter(Product.nome.ilike(f"%{nome}%"))
    if codigo:
        query = query.filter(Product.codigo == codigo)
    if categoria_id:
        query = query.filter(Product.categoria_id == categoria_id)

    products = query.all()

    products_list = []
    for product in products:
        products_list.append({
            "id": product.id,
            "nome": product.nome,
            "codigo": product.codigo,
            "quantidade": product.quantidade, 
            "unid_medida": product.unid_medida,
            "estoque_minimo": product.estoque_minimo,
            "ativo": product.ativo,
            "categoria_id": product.categoria_id,
            "data_cadastro": product.data_cadastro,
            "estoque_baixo": product.quantidade <= product.estoque_minimo
        })

    return success_message("Produtos listados com sucesso", products_list)


def get_product_by_id_service(product_id: int, db: Session):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        return error_message(
            "Produto não encontrado", code="PRODUCT_NOT_FOUND", status_code=404
        )

    return success_message(
        "Detalhes do produto recuperados com sucesso",
        {
            "id": product.id,
            "nome": product.nome,
            "codigo": product.codigo,
            "quantidade": product.quantidade,
            "unid_medida": product.unid_medida,
            "estoque_minimo": product.estoque_minimo,
            "ativo": product.ativo,
            "categoria_id": product.categoria_id,
            "data_cadastro": product.data_cadastro,
            "estoque_baixo": product.quantidade <= product.estoque_minimo
        }
    )