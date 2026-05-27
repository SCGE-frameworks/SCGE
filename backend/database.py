from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

db_url = os.getenv("DATABASE_URL", "sqlite:///./database.db")
if not db_url:
    raise RuntimeError("DATABASE_URL não está definido. Crie um arquivo .env com DATABASE_URL=sqlite:///./database.db")

engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# dependencia fastApi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
