from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class ColumnDetectionResponse(BaseModel):
    dimensions: Dict[str, List[str]]
    metrics: List[str]
    external_drivers: List[str]

class SchemaMappingBase(BaseModel):
    name: str
    description: Optional[str] = None
    dimension_mappings: Dict[str, List[str]]
    metric_mappings: Dict[str, str]
    time_mappings: Dict[str, str]
    external_drivers: Optional[Dict[str, str]] = None

class SchemaMappingCreate(SchemaMappingBase):
    pass

class SchemaMappingResponse(SchemaMappingBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 