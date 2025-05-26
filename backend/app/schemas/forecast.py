from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class ForecastBase(BaseModel):
    name: str
    description: Optional[str] = None
    forecast_horizon: int
    forecast_frequency: str
    start_date: datetime
    end_date: datetime

class ForecastCreate(ForecastBase):
    pass

class ForecastResponse(ForecastBase):
    id: int
    user_id: int
    schema_mapping_id: int
    selected_model: str
    model_parameters: Dict
    model_metrics: Dict
    forecast_values: Dict
    confidence_intervals: Dict
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ForecastList(BaseModel):
    forecasts: List[ForecastResponse]
    total: int 