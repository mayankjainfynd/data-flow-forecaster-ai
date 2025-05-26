import pandas as pd
from typing import Dict, List, Optional
from app.models.schema import SchemaMapping
from sqlalchemy.orm import Session

class SchemaMappingService:
    @staticmethod
    def detect_columns(df: pd.DataFrame) -> Dict[str, List[str]]:
        """Auto-detect potential mappings for dimensions and metrics."""
        suggestions = {
            "dimensions": {
                "product": [],
                "location": [],
                "time": []
            },
            "metrics": [],
            "external_drivers": [],
            "all_columns": list(df.columns)
        }
        
        # Detect time columns
        for col in df.columns:
            if any(keyword in col.lower() for keyword in ['date', 'time', 'day', 'week', 'month', 'year']):
                suggestions["dimensions"]["time"].append(col)
            
            # Detect product-related columns
            elif any(keyword in col.lower() for keyword in ['sku', 'product', 'item', 'brand', 'category']):
                suggestions["dimensions"]["product"].append(col)
            
            # Detect location-related columns
            elif any(keyword in col.lower() for keyword in ['store', 'location', 'region', 'area', 'zone']):
                suggestions["dimensions"]["location"].append(col)
            
            # Detect metrics
            elif any(keyword in col.lower() for keyword in ['sales', 'revenue', 'quantity', 'amount', 'value']):
                suggestions["metrics"].append(col)
            
            # Detect external drivers
            elif any(keyword in col.lower() for keyword in ['promo', 'discount', 'holiday', 'event']):
                suggestions["external_drivers"].append(col)
        
        return suggestions
    
    @staticmethod
    def validate_mapping(mapping: Dict) -> bool:
        """Validate the schema mapping configuration."""
        required_keys = ["dimension_mappings", "metric_mappings", "time_mappings"]
        
        # Check required keys
        if not all(key in mapping for key in required_keys):
            return False
        
        # Validate time mapping
        if not mapping["time_mappings"].get("date"):
            return False
        
        # Validate at least one metric
        if not mapping["metric_mappings"]:
            return False
        
        return True
    
    @staticmethod
    def create_mapping(
        db: Session,
        user_id: int,
        name: str,
        description: Optional[str],
        dimension_mappings: Dict,
        metric_mappings: Dict,
        time_mappings: Dict,
        external_drivers: Optional[Dict] = None
    ) -> SchemaMapping:
        """Create a new schema mapping."""
        mapping = SchemaMapping(
            user_id=user_id,
            name=name,
            description=description,
            dimension_mappings=dimension_mappings,
            metric_mappings=metric_mappings,
            time_mappings=time_mappings,
            external_drivers=external_drivers
        )
        
        db.add(mapping)
        db.commit()
        db.refresh(mapping)
        return mapping
    
    @staticmethod
    def get_mapping(db: Session, mapping_id: int) -> Optional[SchemaMapping]:
        """Get a schema mapping by ID."""
        return db.query(SchemaMapping).filter(SchemaMapping.id == mapping_id).first()
    
    @staticmethod
    def get_user_mappings(db: Session, user_id: int) -> List[SchemaMapping]:
        """Get all schema mappings for a user."""
        return db.query(SchemaMapping).filter(SchemaMapping.user_id == user_id).all() 