import os
from dotenv import load_dotenv

load_dotenv()

# Configurações do Banco de Dados
DATABASE_URL = "sqlite:///./safeshield.db"

# Configurações da API
API_VERSION = "1.0.0"
API_PREFIX = "/api/v1"

# Configuração de segurança
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuração de ameaças
THREAT_SCORE_THRESHOLD = 0.7  # Score acima deste valor é considerado ameaça

# Configuração da Rede Corporativa
COMPANY_NETWORK = {
    "name": "SafeShield Demo Corp",
    
    # Redes internas (adicione suas subredes)
    "internal_networks": {
        "office": {
            "range": "192.168.1.0/24",
            "description": "Rede do Escritório Principal"
        },
        "vpn": {
            "range": "10.0.0.0/8",
            "description": "Rede VPN Corporativa"
        },
        "servers": {
            "range": "172.16.0.0/12",
            "description": "Rede de Servidores"
        },
        "wifi": {
            "range": "192.168.2.0/24",
            "description": "Rede WiFi Corporativa"
        }
    },
    
    # Ativos críticos da empresa
    "critical_assets": {
        # Servidores de Banco de Dados
        "192.168.1.10": {
            "name": "Database Principal",
            "type": "database",
            "criticality": "ALTA"
        },
        "192.168.1.11": {
            "name": "Database Backup",
            "type": "database",
            "criticality": "ALTA"
        },
        
        # Servidores Web
        "192.168.1.20": {
            "name": "Servidor Web Principal",
            "type": "web",
            "criticality": "ALTA"
        },
        "192.168.1.21": {
            "name": "Servidor Web Homologação",
            "type": "web",
            "criticality": "MÉDIA"
        },
        
        # Servidores de Email
        "192.168.1.30": {
            "name": "Servidor de Email",
            "type": "email",
            "criticality": "ALTA"
        },
        
        # Servidores de Arquivos
        "10.0.0.50": {
            "name": "File Server Principal",
            "type": "storage",
            "criticality": "ALTA"
        },
        
        # Gateways e Serviços
        "172.16.0.100": {
            "name": "Gateway de Pagamentos",
            "type": "payment",
            "criticality": "CRÍTICA"
        },
        "172.16.0.101": {
            "name": "Gateway de API",
            "type": "api",
            "criticality": "ALTA"
        }
    },
    
    # IPs externos autorizados
    "authorized_external_ips": {
        "203.0.113.10": {
            "name": "API Partner 1",
            "description": "Parceiro de Integração Principal",
            "services": ["api", "webhook"]
        },
        "203.0.113.20": {
            "name": "API Partner 2",
            "description": "Serviço de Pagamento Externo",
            "services": ["payment"]
        },
        "203.0.113.30": {
            "name": "Monitoramento Externo",
            "description": "Serviço de Monitoramento",
            "services": ["monitoring"]
        }
    }
}

# Configurações de Segurança
SECURITY_CONFIG = {
    # Limites e Thresholds
    "max_login_attempts": 5,
    "suspicious_transaction_threshold": 5000,
    "session_timeout_minutes": 30,
    
    # Países de Alto Risco
    "high_risk_countries": [
        "RU",  # Rússia
        "CN",  # China
        "KP",  # Coreia do Norte
        "IR",  # Irã
        "BY",  # Bielorrússia
        "MM",  # Myanmar
        "VE",  # Venezuela
        "CU"   # Cuba
    ],
    
    # Notificações
    "notifications": {
        "email": {
            "security_team": "security@empresa.com",
            "it_team": "it@empresa.com",
            "emergency": "emergency@empresa.com"
        },
        "slack": {
            "security_channel": "#security-alerts",
            "it_channel": "#it-monitoring"
        }
    },
    
    # Horários de Operação Normal
    "business_hours": {
        "start": "08:00",
        "end": "18:00",
        "timezone": "America/Sao_Paulo"
    },
    
    # Configurações de Bloqueio
    "blocking": {
        "auto_block_threshold": 10,  # Número de tentativas antes do bloqueio
        "block_duration_minutes": 30,  # Duração do bloqueio
        "whitelist": [
            "192.168.1.0/24",  # Rede interna
            "10.0.0.0/8"       # VPN
        ]
    }
} 