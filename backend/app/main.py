from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.responses import RedirectResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Any
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import random

# Sample data for simulation
SAMPLE_IPS = [
    "45.33.132.12", "185.65.23.145", "103.235.46.78", "91.234.56.17", 
    "77.83.12.45", "209.141.55.23", "31.13.87.12", "118.193.45.27",
    "89.248.167.131", "194.26.29.123", "5.188.206.54", "45.155.205.233",
    "134.209.82.14", "167.99.123.45", "206.189.23.17", "159.65.145.12"
]

SAMPLE_COUNTRIES = ["RU", "CN", "BR", "US", "KP", "IR", "UA", "RO", "NL", "DE", "GB", "FR"]

ATTACK_DESCRIPTIONS = [
    "Tentativa de força bruta detectada",
    "Possível ataque de injeção SQL",
    "Tentativa de acesso não autorizado",
    "Múltiplas falhas de autenticação",
    "Padrão suspeito de requisições",
    "Tentativa de exploração de vulnerabilidade",
    "Scan de portas detectado",
    "Ataque DDoS em andamento",
    "Tentativa de bypass de autenticação",
    "Acesso suspeito a recursos restritos"
]

# Mudar imports para relativos
from backend.database import SessionLocal, engine, Base
from backend.model import predict_threat
from backend.schemas import AccessLog, AccessLogCreate
from backend.crud import create_access_log, get_logs, get_threats

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Configuração da API
app = FastAPI(
    title="🛡️ SafeShield AI",
    description="""
    # Bem-vindo à SafeShield AI

    Sistema inteligente de detecção e prevenção de ameaças cibernéticas.

    ## 🚀 Recursos Principais

    * **🔍 Detecção em Tempo Real**: Análise contínua de atividades suspeitas
    * **🤖 IA Avançada**: Algoritmos de machine learning para identificação de padrões
    * **📊 Analytics**: Dashboard completo de métricas e indicadores
    * **🔔 Alertas**: Notificações instantâneas via múltiplos canais

    ## 🛠️ Guia Rápido

    1. **Autenticação**
       ```bash
       curl -H "Authorization: Bearer seu-token" ...
       ```

    2. **Registrar Log**
       ```bash
       curl -X POST "/api/logs" -d '{"ip": "192.168.1.1", ...}'
       ```

    3. **Consultar Ameaças**
       ```bash
       curl "/api/threats"
       ```

    ## 📚 Documentação Detalhada

    * [Guia de Início Rápido](https://docs.safeshield.ai/quickstart)
    * [Referência da API](https://docs.safeshield.ai/api)
    * [Exemplos de Uso](https://docs.safeshield.ai/examples)

    ## 🔐 Segurança

    * Autenticação via JWT
    * Criptografia end-to-end
    * Conformidade com LGPD/GDPR
    * Certificação ISO 27001

    ## 💡 Suporte

    * Email: suporte@safeshield.ai
    * Chat: https://safeshield.ai/chat
    * Docs: https://docs.safeshield.ai
    """,
    version="1.0.0",
    docs_url=None,  # Desabilita Swagger UI padrão
    redoc_url=None  # Desabilita ReDoc padrão
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency para banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rotas de Documentação
@app.get("/", include_in_schema=False)
async def docs_redirect():
    """Redireciona para documentação"""
    return RedirectResponse(url="/docs")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Swagger UI customizada"""
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="SafeShield AI - API Documentation",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    """ReDoc customizada"""
    return get_redoc_html(
        openapi_url="/openapi.json",
        title="SafeShield AI - API Reference",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    )

# Rotas da API
@app.get("/api/status", tags=["Sistema"])
async def system_status():
    """Status do sistema"""
    return {
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/logs", 
    response_model=AccessLog,
    tags=["Logs"],
    summary="Registrar novo log de acesso",
    description="Registra e analisa um novo log de acesso em busca de ameaças")
async def create_log(log: AccessLogCreate, db: Session = Depends(get_db)):
    threat_score = predict_threat(log)
    return create_access_log(db=db, log=log, threat_score=threat_score)

@app.get("/api/logs",
    response_model=List[AccessLog],
    tags=["Logs"],
    summary="Listar logs de acesso")
async def list_logs(
    skip: int = 0,
    limit: int = 100,
    sort: str = "desc",
    db: Session = Depends(get_db)
):
    """Lista logs de acesso ordenados por timestamp"""
    return get_logs(db, skip=skip, limit=limit, sort=sort)

@app.get("/api/threats",
    tags=["Ameaças"],
    summary="Listar ameaças detectadas")
async def list_threats(db: Session = Depends(get_db)):
    return get_threats(db)

@app.post("/api/simulate-event")
async def simulate_event(db: Session = Depends(get_db)):
    """Simula um evento de acesso para teste"""
    # Gera timestamp aleatório nos últimos 5 minutos
    timestamp = datetime.now() - timedelta(minutes=random.randint(0, 5))
    
    # 80% de chance de ser um ataque
    is_attack = random.random() < 0.8
    
    log = AccessLogCreate(
        ip_address=random.choice(SAMPLE_IPS),
        country=random.choice(SAMPLE_COUNTRIES),
        login_attempts=random.randint(5, 20) if is_attack else random.randint(1, 3),
        transaction_value=random.uniform(100, 10000),
        description=random.choice(ATTACK_DESCRIPTIONS) if is_attack else "Acesso normal ao sistema",
        timestamp=timestamp
    )
    
    threat_score = predict_threat(log)
    return create_access_log(db=db, log=log, threat_score=threat_score)

@app.post("/api/simulate-multiple")
async def simulate_multiple_events(count: int = 10, db: Session = Depends(get_db)):
    """Simula múltiplos eventos de acesso para teste"""
    events = []
    for _ in range(count):
        log = AccessLogCreate(
            ip_address=random.choice(SAMPLE_IPS),
            country=random.choice(SAMPLE_COUNTRIES),
            login_attempts=random.randint(1, 5),
            transaction_value=random.uniform(100, 10000)
        )
        threat_score = predict_threat(log)
        event = create_access_log(db=db, log=log, threat_score=threat_score)
        events.append(event)
    
    return events

# Inicialização
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 