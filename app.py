from fastapi import FastAPI

from src.routes.authentication import router as auth_router
from src.routes.items import router as items_router
from src.routes.users import router as users_router

app = FastAPI(title="SCGE API")

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(items_router)
