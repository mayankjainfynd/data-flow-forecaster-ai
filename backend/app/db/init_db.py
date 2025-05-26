from sqlalchemy.orm import Session
from app.db.session import engine
from app.models.base import Base
from app.models.user import User
from app.models.schema import SchemaMapping
from app.models.forecast import Forecast
from app.models.forecast_result import ForecastResult

def init_db() -> None:
    # Create all tables
    Base.metadata.drop_all(bind=engine)  # Drop all tables first
    Base.metadata.create_all(bind=engine)  # Create all tables

if __name__ == "__main__":
    print("Creating initial data")
    init_db()
    print("Initial data created") 