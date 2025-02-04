from sqlalchemy import Boolean, Column, Float, Integer, String, DateTime
from backend.database import Base
import datetime

class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String)
    country = Column(String)
    login_attempts = Column(Integer)
    transaction_value = Column(Float, nullable=True)
    is_threat = Column(Boolean, default=False)
    threat_score = Column(Float) 