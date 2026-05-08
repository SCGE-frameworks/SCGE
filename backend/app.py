from fastapi import FastAPI
import uvicorn

app = FastAPI(title="SCGE API")

from routes.autenticacao_routes import router as auth_router
from routes.item_routes import router as items_router
from routes.usuario_routes import router as users_router
from routes.movimentacao_routes import router as movements_router
from routes.cargo_routes import router as roles_router
from routes.categoria_routes import router as categories_router

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(items_router)
app.include_router(movements_router)
app.include_router(roles_router)
app.include_router(categories_router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)