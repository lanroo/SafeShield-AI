from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AccessLogBase(BaseModel):
    ip_address: str
    country: str
    login_attempts: int
    transaction_value: Optional[float] = None

class AccessLogCreate(AccessLogBase):
    pass

class AccessLog(AccessLogBase):
    id: int
    timestamp: datetime
    is_threat: bool
    threat_score: float

    class Config:
        from_attributes = True 