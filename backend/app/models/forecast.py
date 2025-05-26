from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Forecast(BaseModel):
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    schema_mapping_id = Column(Integer, ForeignKey("schema_mappings.id"))
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    model_type = Column(String)  # e.g., "prophet", "arima", "lstm"
    model_config = Column(JSON)  # Model-specific configuration
    forecast_horizon = Column(Integer)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="forecasts")
    schema_mapping = relationship("SchemaMapping", back_populates="forecasts")
    # Use string for class name and set lazy='dynamic' to avoid circular import
    results = relationship("ForecastResult", back_populates="forecast", lazy='dynamic')
    
    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

# Import ForecastResult at the end to avoid circular import
from .forecast_result import ForecastResult 