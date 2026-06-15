from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import engine
from models import Base
from routes import (
    auth_router,
    categories_router,
    items_router,
    movements_router,
    products_router,
    roles_router,
    users_router,
)

app = FastAPI(title="SCGE API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
