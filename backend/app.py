from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from database import create_initial_seed
from core.config import CORS_ORIGINS
from database import Base, SessionLocal, engine
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

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if FRONTEND_DIST.is_dir():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    _index_file = FRONTEND_DIST / "index.html"

    @app.get("/")
    def serve_root():
        return FileResponse(_index_file)

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        requested = FRONTEND_DIST / full_path
        if full_path and requested.is_file():
            return FileResponse(requested)
        return FileResponse(_index_file)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

