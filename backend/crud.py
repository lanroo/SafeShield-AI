from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import AccessLog, Asset
from schemas import AccessLogCreate
from datetime import datetime

def create_access_log(db: Session, log: AccessLogCreate, threat_score: float):
    """Cria um novo log de acesso"""
    db_log = AccessLog(
        ip_address=log.ip_address,
        country=log.country,
        timestamp=log.timestamp or datetime.now(),
        login_attempts=log.login_attempts,
        transaction_value=log.transaction_value,
        description=log.description,
        threat_score=threat_score,
        is_threat=threat_score > 0.7,
        is_internal=log.is_internal,
        asset_name=log.asset_name,
        network_zone=log.network_zone,
        is_authorized=log.is_authorized,
        alert_level=log.alert_level
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_logs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    sort: str = "desc",
    network_zone: str = None,
    asset_type: str = None,
    criticality: str = None,
    alert_level: str = None,
    start_time: datetime = None,
    count_only: bool = False
):
    """Obtém logs com filtros"""
    query = db.query(AccessLog)

    # Aplica filtros
    if network_zone:
        query = query.filter(AccessLog.network_zone == network_zone)
    
    if asset_type:
        query = query.join(AccessLog.asset).filter(Asset.type == asset_type)
    
    if criticality:
        query = query.filter(AccessLog.alert_level == criticality)
    
    if alert_level:
        query = query.filter(AccessLog.alert_level == alert_level)
    
    if start_time:
        query = query.filter(AccessLog.timestamp >= start_time)

    # Se só quer a contagem
    if count_only:
        return query.count()

    # Aplica ordenação
    if sort == "desc":
        query = query.order_by(desc(AccessLog.timestamp))
    else:
        query = query.order_by(AccessLog.timestamp)

    # Aplica paginação
    return query.offset(skip).limit(limit).all()

def get_threats(db: Session):
    """Obtém apenas eventos considerados ameaças"""
    return db.query(AccessLog).filter(
        AccessLog.threat_score > 0.7
    ).order_by(desc(AccessLog.timestamp)).all() 