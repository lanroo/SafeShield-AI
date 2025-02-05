from backend.database import engine, Base
from backend.models import Asset, AccessLog
import logging
from sqlalchemy import inspect

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database by creating all tables."""
    try:
        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Verify tables were created
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f"Created tables: {', '.join(tables)}")
        
        # Verify specific tables exist
        required_tables = {'assets', 'access_logs'}
        missing_tables = required_tables - set(tables)
        if missing_tables:
            raise Exception(f"Failed to create tables: {', '.join(missing_tables)}")
            
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_db() 