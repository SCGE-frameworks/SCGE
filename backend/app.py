import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_initial_seed
from core.config import CORS_ORIGINS
from database import Base, SessionLocal, engine, get_db
from routes import (
    auth_router,
    categories_router,
    movements_router,
    products_router,
    roles_router,
    users_router,
    reports_router,
)

app = FastAPI(title="SCGE API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(movements_router)
app.include_router(roles_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(reports_router)

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    create_initial_seed(db)
finally:
    db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

