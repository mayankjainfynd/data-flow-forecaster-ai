from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class ForecastResult(BaseModel):
    __tablename__ = "forecast_results"
    
    id = Column(Integer, primary_key=True, index=True)
    forecast_id = Column(Integer, ForeignKey("forecasts.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    predicted_value = Column(Float, nullable=False)
    actual_value = Column(Float, nullable=True)
    confidence_interval = Column(JSON, nullable=True)  # Store as JSON: {"lower": value, "upper": value}
    
    # Relationships
    forecast = relationship("Forecast", back_populates="results")
    
    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2 