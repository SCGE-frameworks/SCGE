from fastapi import FastAPI

app = FastAPI(title="SCGE API")

from src.routes.auth_routes import router as auth_router
from src.routes.items_routes import router as items_router
from src.routes.users_routes import router as users_router
from src.routes.movements_routes import router as movements_router
from src.routes.roles_routes import router as roles_router
from src.routes.categories_routes import router as categories_router

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(items_router)
app.include_router(movements_router)
app.include_router(roles_router)
app.include_router(categories_router)

