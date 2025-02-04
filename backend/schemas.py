from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AccessLogBase(BaseModel):
    ip_address: str
    country: str
    login_attempts: int
    transaction_value: Optional[float] = None

class AccessLogCreate(BaseModel):
    ip_address: str
    country: str
    timestamp: Optional[datetime] = None
    login_attempts: Optional[int] = 0
    transaction_value: Optional[float] = 0.0
    description: str
    threat_score: Optional[float] = 0.0
    is_threat: Optional[bool] = False
    is_internal: Optional[bool] = False
    asset_name: Optional[str] = None
    network_zone: Optional[str] = None
    is_authorized: Optional[bool] = True
    alert_level: Optional[str] = None

class AccessLog(AccessLogCreate):
    id: int
    
    class Config:
        from_attributes = True 