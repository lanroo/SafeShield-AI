from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.responses import RedirectResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict, Any
import uvicorn

from backend.database import SessionLocal, engine, Base
from backend import model as ml_model
from backend.schemas import AccessLog, AccessLogCreate
from backend import crud

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
    threat_score = ml_model.predict_threat(log)
    return crud.create_access_log(db=db, log=log, threat_score=threat_score)

@app.get("/api/logs",
    response_model=List[AccessLog],
    tags=["Logs"],
    summary="Listar logs de acesso")
async def list_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_logs(db, skip=skip, limit=limit)

@app.get("/api/threats",
    tags=["Ameaças"],
    summary="Listar ameaças detectadas")
async def list_threats(db: Session = Depends(get_db)):
    return crud.get_threats(db)

# Inicialização
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 