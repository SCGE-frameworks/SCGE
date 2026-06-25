from .authentication_routes import router as auth_router
from .category_routes import router as categories_router
from .movement_routes import router as movements_router
from .product_routes import router as products_router
from .role_routes import router as roles_router
from .user_routes import router as users_router
from .report_routes import router as reports_router

__all__ = [
    "auth_router",
    "categories_router",
    "movements_router",
    "products_router",
    "reports_router",
    "roles_router",
    "users_router",
]
