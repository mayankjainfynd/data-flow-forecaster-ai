from fastapi import APIRouter
from app.api.api_v1.endpoints import schema, forecast, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(schema.router, prefix="/schema", tags=["schema mapping"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["forecasting"]) 