import os
from dotenv import load_dotenv

load_dotenv()

# Configurações do Banco de Dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./safeshield.db")

# Configurações da API
API_VERSION = "1.0.0"
API_PREFIX = "/api/v1"

# Limites de segurança
MAX_LOGIN_ATTEMPTS = 5
THREAT_SCORE_THRESHOLD = 0.7 