from database import Base
from .user import User
from .product import Product
# from .category import Category  # reativar quando categorias estiverem implementadas

__all__ = ["User", "Product"]
