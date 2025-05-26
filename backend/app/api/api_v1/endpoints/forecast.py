from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.forecasting import ForecastingService
from app.schemas.forecast import (
    ForecastCreate,
    ForecastResponse,
    ForecastList
)

router = APIRouter()

@router.post("/generate", response_model=ForecastResponse)
async def generate_forecast(
    mapping_id: int,
    forecast: ForecastCreate,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate a new forecast using the specified schema mapping."""
    if not file.filename.endswith(('.csv', '.xlsx', '.parquet')):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    try:
        # Read the data file
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(file.file)
        else:
            df = pd.read_parquet(file.file)
        
        # Select the best model
        model_name, model_params = ForecastingService.select_model(
            df,
            forecast.forecast_frequency
        )
        
        # Generate forecast
        forecast_values, confidence_intervals = ForecastingService.generate_forecast(
            data=df,
            model_name=model_name,
            model_params=model_params,
            horizon=forecast.forecast_horizon,
            frequency=forecast.forecast_frequency
        )
        
        # Create forecast record
        forecast_record = ForecastingService.create_forecast(
            db=db,
            user_id=current_user.id,
            schema_mapping_id=mapping_id,
            name=forecast.name,
            description=forecast.description,
            forecast_horizon=forecast.forecast_horizon,
            forecast_frequency=forecast.forecast_frequency,
            start_date=forecast.start_date,
            end_date=forecast.end_date,
            selected_model=model_name,
            model_parameters=model_params,
            model_metrics={},  # Add metrics calculation
            forecast_values=forecast_values,
            confidence_intervals=confidence_intervals
        )
        
        return forecast_record
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/forecasts", response_model=List[ForecastResponse])
async def get_forecasts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all forecasts for the current user."""
    return ForecastingService.get_user_forecasts(db, current_user.id)

@router.get("/forecasts/{forecast_id}", response_model=ForecastResponse)
async def get_forecast(
    forecast_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific forecast by ID."""
    forecast = ForecastingService.get_forecast(db, forecast_id)
    if not forecast:
        raise HTTPException(status_code=404, detail="Forecast not found")
    if forecast.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this forecast")
    return forecast 