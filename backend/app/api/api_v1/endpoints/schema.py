from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.schema_mapping import SchemaMappingService
from app.schemas.schema import (
    SchemaMappingCreate,
    SchemaMappingResponse,
    ColumnDetectionResponse
)

router = APIRouter()

@router.post("/detect-columns", response_model=ColumnDetectionResponse)
async def detect_columns(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Detect potential column mappings from uploaded data."""
    if not file.filename.endswith(('.csv', '.xlsx', '.parquet')):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(file.file)
        else:
            df = pd.read_parquet(file.file)
        
        suggestions = SchemaMappingService.detect_columns(df)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/mappings", response_model=SchemaMappingResponse)
async def create_mapping(
    mapping: SchemaMappingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new schema mapping."""
    if not SchemaMappingService.validate_mapping(mapping.dict()):
        raise HTTPException(status_code=400, detail="Invalid mapping configuration")
    
    try:
        schema_mapping = SchemaMappingService.create_mapping(
            db=db,
            user_id=current_user.id,
            name=mapping.name,
            description=mapping.description,
            dimension_mappings=mapping.dimension_mappings,
            metric_mappings=mapping.metric_mappings,
            time_mappings=mapping.time_mappings,
            external_drivers=mapping.external_drivers
        )
        return schema_mapping
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/mappings", response_model=List[SchemaMappingResponse])
async def get_mappings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all schema mappings for the current user."""
    return SchemaMappingService.get_user_mappings(db, current_user.id)

@router.get("/mappings/{mapping_id}", response_model=SchemaMappingResponse)
async def get_mapping(
    mapping_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific schema mapping by ID."""
    mapping = SchemaMappingService.get_mapping(db, mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
    if mapping.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this mapping")
    return mapping 