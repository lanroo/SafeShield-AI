from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)  # database, web, email, storage, payment, api
    criticality = Column(String)  # BAIXA, MÉDIA, ALTA, CRÍTICA
    logs = relationship("AccessLog", back_populates="asset")

class AccessLog(Base):
    """Modelo para logs de acesso"""
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, index=True)
    country = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
    login_attempts = Column(Integer, default=0)
    transaction_value = Column(Float, default=0.0)
    description = Column(String)
    threat_score = Column(Float)
    is_threat = Column(Boolean, default=False)
    
    # Novos campos para rede corporativa
    is_internal = Column(Boolean, default=False)  # Se é da rede interna
    asset_name = Column(String)    # Nome do ativo (se for um ativo crítico)
    network_zone = Column(String)  # Zona da rede (local, vpn, dmz)
    is_authorized = Column(Boolean, default=True)  # Se é um IP autorizado
    alert_level = Column(String)   # BAIXO, MÉDIO, ALTO, CRÍTICO 
    
    asset_id = Column(Integer, ForeignKey("assets.id"))
    asset = relationship("Asset", back_populates="logs")