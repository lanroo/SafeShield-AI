import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from schemas import AccessLog, AccessLogCreate
from crud import create_access_log, get_logs, get_threats
from model import predict_threat
from network_analyzer import analyze_ip, calculate_alert_level
from datetime import datetime, timedelta
import random
from config import COMPANY_NETWORK

# Sample data for simulation
SAMPLE_IPS = [
    # IPs internos (rede local)
    "192.168.1.10",  # Servidor de Banco de Dados
    "192.168.1.20",  # Servidor Web
    "192.168.1.30",  # Servidor de Email
    "192.168.1.100", # Estação de trabalho
    "192.168.1.101", # Estação de trabalho
    
    # IPs da VPN
    "10.0.0.50",     # Servidor de Arquivos
    "10.0.0.100",    # Usuário VPN
    "10.0.0.101",    # Usuário VPN
    
    # IPs externos maliciosos
    "45.33.132.12", 
    "185.65.23.145", 
    "103.235.46.78",
    
    # IPs de parceiros autorizados
    "203.0.113.10",  # API Partner 1
    "203.0.113.20"   # API Partner 2
]

SAMPLE_COUNTRIES = {
    "RU": "🇷🇺 Rússia",
    "CN": "🇨🇳 China",
    "BR": "🇧🇷 Brasil",
    "US": "🇺🇸 Estados Unidos",
    "KP": "🇰🇵 Coreia do Norte",
    "IR": "🇮🇷 Irã",
    "UA": "🇺🇦 Ucrânia",
    "RO": "🇷🇴 Romênia",
    "NL": "🇳🇱 Holanda",
    "DE": "🇩🇪 Alemanha"
}

ATTACK_PATTERNS = [
    {
        "type": "BRUTE_FORCE",
        "description": "⚠️ Tentativa de força bruta detectada",
        "details": "Múltiplas tentativas de login com diferentes senhas",
        "severity": "ALTA",
        "cve": "CVE-2023-1234",
        "technique": "T1110 - Brute Force"
    },
    {
        "type": "SQL_INJECTION",
        "description": "🚨 Possível ataque de injeção SQL",
        "details": "Payload malicioso detectado nos parâmetros da requisição",
        "severity": "CRÍTICA",
        "cve": "CVE-2023-5678",
        "technique": "T1190 - Exploit Public-Facing Application"
    },
    {
        "type": "UNAUTHORIZED",
        "description": "🔒 Tentativa de acesso não autorizado",
        "details": "Tentativa de acesso a recursos restritos",
        "severity": "MÉDIA",
        "cve": None,
        "technique": "T1078 - Valid Accounts"
    },
    {
        "type": "AUTH_FAILURE",
        "description": "⛔ Múltiplas falhas de autenticação",
        "details": "Sequência suspeita de falhas de login",
        "severity": "MÉDIA",
        "cve": None,
        "technique": "T1110.001 - Password Guessing"
    },
    {
        "type": "SUSPICIOUS_PATTERN",
        "description": "👀 Padrão suspeito de requisições",
        "details": "Comportamento anômalo detectado no padrão de acesso",
        "severity": "BAIXA",
        "cve": None,
        "technique": "T1595 - Active Scanning"
    },
    {
        "type": "DDOS_ATTEMPT",
        "description": "💥 Possível tentativa de DDoS",
        "details": "Alto volume de requisições em curto período",
        "severity": "CRÍTICA",
        "cve": None,
        "technique": "T1498 - Network Denial of Service"
    },
    {
        "type": "MALWARE_DETECTED",
        "description": "🦠 Malware detectado",
        "details": "Assinatura de malware conhecida identificada",
        "severity": "CRÍTICA",
        "cve": "CVE-2023-9012",
        "technique": "T1587 - Develop Capabilities"
    },
    {
        "type": "DATA_EXFILTRATION",
        "description": "📤 Possível exfiltração de dados",
        "details": "Transferência suspeita de grande volume de dados",
        "severity": "ALTA",
        "cve": None,
        "technique": "T1048 - Exfiltration Over Alternative Protocol"
    }
]

NORMAL_ACTIVITIES = [
    {
        "type": "NORMAL_ACCESS",
        "description": "✅ Acesso normal ao sistema",
        "details": "Login bem-sucedido com credenciais válidas",
        "severity": "BAIXA"
    },
    {
        "type": "ROUTINE_CHECK",
        "description": "✅ Verificação de rotina",
        "details": "Acesso periódico para manutenção",
        "severity": "BAIXA"
    },
    {
        "type": "API_CALL",
        "description": "✅ Chamada API autorizada",
        "details": "Requisição API com token válido",
        "severity": "BAIXA"
    }
]

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Rota raiz com informações da API"""
    return {
        "name": "SafeShield API",
        "version": "1.0.0",
        "endpoints": {
            "logs": "/api/logs",
            "threats": "/api/threats",
            "simulate_event": "/api/simulate-event",
            "simulate_multiple": "/api/simulate-multiple"
        }
    }

# Dependency para banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Criar tabelas
Base.metadata.create_all(bind=engine)

@app.get("/api/logs")
async def list_logs(
    skip: int = 0,
    limit: int = 100,
    sort: str = "desc",
    db: Session = Depends(get_db)
):
    """Lista logs de acesso ordenados por timestamp"""
    return get_logs(db, skip=skip, limit=limit, sort=sort)

@app.get("/api/threats")
async def list_threats(db: Session = Depends(get_db)):
    """Lista ameaças detectadas"""
    return get_threats(db)

@app.post("/api/simulate-event")
async def simulate_event(db: Session = Depends(get_db)):
    """Simula um evento de acesso para teste"""
    timestamp = datetime.now() - timedelta(minutes=random.randint(0, 5))
    
    # Seleciona IP e analisa
    ip_address = random.choice(SAMPLE_IPS)
    ip_info = analyze_ip(ip_address)
    
    # Define comportamento baseado no tipo de IP
    if ip_info["is_internal"]:
        is_attack = random.random() < 0.2  # 20% chance de ataque interno
    else:
        is_attack = random.random() < 0.8  # 80% chance de ataque externo
    
    if is_attack:
        event_type = random.choice(ATTACK_PATTERNS)
        login_attempts = random.randint(5, 20)
    else:
        event_type = random.choice(NORMAL_ACTIVITIES)
        login_attempts = random.randint(1, 3)
    
    country_code = random.choice(list(SAMPLE_COUNTRIES.keys()))
    country_name = SAMPLE_COUNTRIES[country_code]
    
    # Monta descrição com informações da rede
    network_info = f"[{ip_info['network_zone'].upper()}]" if ip_info['network_zone'] else ""
    asset_info = f"[{ip_info['asset_name']}]" if ip_info['asset_name'] else ""
    description = f"{network_info} {asset_info} {event_type['description']} | {event_type['details']}"
    
    if is_attack and event_type.get('cve'):
        description += f" | {event_type['cve']}"
    if is_attack and event_type.get('technique'):
        description += f" | {event_type['technique']}"
    
    # Calcula nível de alerta
    alert_level = calculate_alert_level(ip_info, login_attempts, country_code)
    
    log = AccessLogCreate(
        ip_address=ip_address,
        country=f"{country_code} - {country_name}",
        login_attempts=login_attempts,
        transaction_value=random.uniform(100, 10000),
        description=description,
        timestamp=timestamp,
        is_internal=ip_info["is_internal"],
        asset_name=ip_info["asset_name"],
        network_zone=ip_info["network_zone"],
        is_authorized=ip_info["is_authorized"],
        alert_level=alert_level
    )
    
    threat_score = predict_threat(log)
    return create_access_log(db=db, log=log, threat_score=threat_score)

@app.post("/api/simulate-multiple")
async def simulate_multiple_events(count: int = 10, db: Session = Depends(get_db)):
    """Simula múltiplos eventos de acesso para teste"""
    events = []
    for _ in range(count):
        ip_address = generate_random_ip()
        ip_info = analyze_ip(ip_address)
        
        asset = generate_random_asset()
        
        log = AccessLogCreate(
            description=f"Acesso ao {asset['name']}",
            ip_address=ip_address,
            country=ip_info['country'],
            threat_score=random.uniform(0, 1),
            alert_level=ip_info['alert_level'],
            network_zone=ip_info['network_zone'],
            asset_name=ip_info['asset_name'] or asset['name'],
            is_internal=ip_info['is_internal'],
            is_authorized=ip_info['is_authorized'],
            timestamp=datetime.now()
        )
        
        threat_score = predict_threat(log)
        event = create_access_log(db=db, log=log, threat_score=threat_score)
        events.append(event)
    return events

@app.get("/api/logs/network/{network_zone}")
async def list_logs_by_network(
    network_zone: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lista logs de uma zona de rede específica (local, vpn, dmz, etc)"""
    return get_logs(db, skip=skip, limit=limit, network_zone=network_zone)

@app.get("/api/logs/asset/{asset_type}")
async def list_logs_by_asset_type(
    asset_type: str,  # database, web, email, storage, payment, api
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lista logs de um tipo específico de ativo"""
    return get_logs(db, skip=skip, limit=limit, asset_type=asset_type)

@app.get("/api/logs/criticality/{level}")
async def list_logs_by_criticality(
    level: str,  # BAIXA, MÉDIA, ALTA, CRÍTICA
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lista logs por nível de criticidade"""
    return get_logs(db, skip=skip, limit=limit, criticality=level)

@app.get("/api/stats/network")
async def get_network_stats(db: Session = Depends(get_db)):
    """Retorna estatísticas por zona de rede"""
    return {
        "local": get_logs(db, network_zone="local", count_only=True),
        "vpn": get_logs(db, network_zone="vpn", count_only=True),
        "dmz": get_logs(db, network_zone="dmz", count_only=True),
        "external": get_logs(db, network_zone="external", count_only=True)
    }

@app.get("/api/stats/assets")
async def get_asset_stats(db: Session = Depends(get_db)):
    """Retorna estatísticas por tipo de ativo"""
    return {
        "database": get_logs(db, asset_type="database", count_only=True),
        "web": get_logs(db, asset_type="web", count_only=True),
        "email": get_logs(db, asset_type="email", count_only=True),
        "storage": get_logs(db, asset_type="storage", count_only=True),
        "payment": get_logs(db, asset_type="payment", count_only=True),
        "api": get_logs(db, asset_type="api", count_only=True)
    }

@app.get("/api/stats/threats")
async def get_threat_stats(db: Session = Depends(get_db)):
    """Retorna estatísticas por nível de ameaça"""
    return {
        "BAIXA": get_logs(db, alert_level="BAIXA", count_only=True),
        "MÉDIA": get_logs(db, alert_level="MÉDIA", count_only=True),
        "ALTA": get_logs(db, alert_level="ALTA", count_only=True),
        "CRÍTICA": get_logs(db, alert_level="CRÍTICA", count_only=True)
    }

@app.get("/api/logs/time/{time_range}")
async def list_logs_by_time(
    time_range: str,  # 1h, 24h, 7d, 30d
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lista logs por período de tempo"""
    now = datetime.now()
    
    if time_range == "1h":
        start_time = now - timedelta(hours=1)
    elif time_range == "24h":
        start_time = now - timedelta(days=1)
    elif time_range == "7d":
        start_time = now - timedelta(days=7)
    elif time_range == "30d":
        start_time = now - timedelta(days=30)
    else:
        raise HTTPException(status_code=400, detail="Período inválido")
    
    return get_logs(db, skip=skip, limit=limit, start_time=start_time)

@app.get("/api/config/monitoring")
async def get_monitoring_config():
    """Retorna as configurações de monitoramento disponíveis"""
    return {
        "network_zones": [
            {"id": "local", "name": "Rede Local", "description": "Rede do escritório"},
            {"id": "vpn", "name": "VPN", "description": "Acessos via VPN"},
            {"id": "dmz", "name": "DMZ", "description": "Zona desmilitarizada"},
            {"id": "external", "name": "Externa", "description": "Acessos externos"}
        ],
        "asset_types": [
            {"id": "database", "name": "Banco de Dados", "icon": "🗄️"},
            {"id": "web", "name": "Servidores Web", "icon": "🌐"},
            {"id": "email", "name": "Email", "icon": "📧"},
            {"id": "storage", "name": "Armazenamento", "icon": "💾"},
            {"id": "payment", "name": "Pagamentos", "icon": "💳"},
            {"id": "api", "name": "APIs", "icon": "🔌"}
        ],
        "criticality_levels": [
            {"id": "BAIXA", "name": "Baixa", "color": "#4caf50"},
            {"id": "MÉDIA", "name": "Média", "color": "#ff9800"},
            {"id": "ALTA", "name": "Alta", "color": "#f44336"},
            {"id": "CRÍTICA", "name": "Crítica", "color": "#d32f2f"}
        ]
    }

def generate_random_ip():
    """Gera um IP aleatório"""
    return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"

def generate_random_asset():
    """Gera um asset aleatório"""
    assets = [
        {"name": "Servidor Web Principal", "criticality": "ALTA"},
        {"name": "Banco de Dados Produção", "criticality": "ALTA"},
        {"name": "Servidor de Email", "criticality": "MÉDIA"},
        {"name": "Sistema de Backup", "criticality": "MÉDIA"},
        {"name": "Servidor de Desenvolvimento", "criticality": "BAIXA"},
        {"name": "Estação de Trabalho", "criticality": "BAIXA"}
    ]
    return random.choice(assets)

def generate_alert_level():
    """Gera um nível de alerta aleatório"""
    return random.choice(["BAIXO", "MÉDIO", "ALTO", "CRÍTICO"])

if __name__ == "__main__":
    print("🚀 Iniciando servidor backend na porta 8002...")
    uvicorn.run("app:app", host="0.0.0.0", port=8002, reload=True) 