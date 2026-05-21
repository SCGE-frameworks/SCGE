from fastapi import FastAPI
import uvicorn

from database import engine
from models import Base

app = FastAPI(title="SCGE API")

from routes.authentication_routes import router as auth_router
from routes.item_routes import router as items_router
from routes.user_routes import router as users_router
from routes.movement_routes import router as movements_router
from routes.role_routes import router as roles_router
from routes.category_routes import router as categories_router  # reativar quando categorias estiverem implementadas
from routes.product_routes import router as products_router

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(items_router)
app.include_router(movements_router)
app.include_router(roles_router)
app.include_router(categories_router)
app.include_router(products_router)

Base.metadata.create_all(bind=engine)

 
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
