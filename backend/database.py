from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config import DATABASE_URL

# Criar engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Sessão local para operações no banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Função para obter DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 