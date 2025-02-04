from sqlalchemy.orm import Session
from datetime import datetime
from . import schemas

def create_access_log(db: Session, log: schemas.AccessLogCreate, threat_score: float):
    db_log = schemas.AccessLog(
        **log.dict(),
        timestamp=datetime.now(),
        threat_score=threat_score
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.AccessLog).offset(skip).limit(limit).all()

def get_threats(db: Session):
    return db.query(schemas.AccessLog).filter(
        schemas.AccessLog.threat_score > 0.5
    ).all() 