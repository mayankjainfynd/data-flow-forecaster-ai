from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class SchemaMapping(BaseModel):
    __tablename__ = "schema_mappings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    date_column = Column(String)
    target_column = Column(String)
    feature_columns = Column(JSON)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    # Store the mapping configuration as JSON
    dimension_mappings = Column(JSON)  # e.g., {"product": ["sku", "brand"], "location": ["store", "region"]}
    metric_mappings = Column(JSON)     # e.g., {"sales": "sales_qty", "revenue": "sales_value"}
    time_mappings = Column(JSON)       # e.g., {"date": "transaction_date", "frequency": "daily"}
    external_drivers = Column(JSON)    # e.g., {"promo": "promo_flag", "holiday": "holiday_name"}
    
    # Relationships
    user = relationship("User", back_populates="schema_mappings")
    forecasts = relationship("Forecast", back_populates="schema_mapping")
    
    class Config:
        orm_mode = True 