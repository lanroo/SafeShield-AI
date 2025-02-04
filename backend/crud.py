from sqlalchemy.orm import Session
from backend.models import AccessLog as DBAccessLog
from backend.schemas import AccessLogCreate
from backend.config import THREAT_SCORE_THRESHOLD

def create_access_log(db: Session, log: AccessLogCreate, threat_score: float):
    is_threat = threat_score >= THREAT_SCORE_THRESHOLD
    db_log = DBAccessLog(
        ip_address=log.ip_address,
        country=log.country,
        login_attempts=log.login_attempts,
        transaction_value=log.transaction_value,
        threat_score=threat_score,
        is_threat=is_threat
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DBAccessLog).offset(skip).limit(limit).all()

def get_threats(db: Session):
    return db.query(DBAccessLog).filter(DBAccessLog.is_threat == True).all() 