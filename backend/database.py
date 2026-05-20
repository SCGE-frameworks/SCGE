from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="./.env")

db_url = os.getenv("DATABASE_URL")

print(os.getenv("DATABASE_URL"))


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
