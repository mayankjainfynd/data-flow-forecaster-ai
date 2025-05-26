from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Intelligent Forecasting System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database
    DATABASE_URL: str = "sqlite:///./ifs.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # File upload
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_EXTENSIONS: set = {"csv", "xlsx", "parquet"}
    
    # Model settings
    DEFAULT_FORECAST_HORIZON: int = 12
    MIN_DATA_POINTS: int = 24
    MAX_FORECAST_HORIZON: int = 52
    
    class Config:
        case_sensitive = True

settings = Settings() 