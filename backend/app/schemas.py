from pydantic import BaseModel
from datetime import datetime

class AccessLogCreate(BaseModel):
    ip_address: str
    country: str
    login_attempts: int
    transaction_value: float

class AccessLog(AccessLogCreate):
    id: int
    timestamp: datetime
    threat_score: float

    class Config:
        from_attributes = True 