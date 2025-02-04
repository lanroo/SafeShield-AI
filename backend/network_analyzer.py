import ipaddress
from config import COMPANY_NETWORK, SECURITY_CONFIG

def analyze_ip(ip_address: str) -> dict:
    """Analisa um IP para determinar se é interno, crítico ou autorizado"""
    ip_obj = ipaddress.ip_address(ip_address)
    
    # Define network zones
    networks = {
        'local': '192.168.1.0/24',
        'vpn': '10.0.0.0/16',
        'dmz': '172.16.0.0/24'
    }
    
    # Find which network zone the IP belongs to
    network_zone = 'external'  # Default to external
    for zone, network in networks.items():
        try:
            if ip_obj in ipaddress.ip_network(network):
                network_zone = zone
                break
        except ValueError:
            continue
    
    # Get country info (mock)
    country = "BR - Brasil"  # In a real scenario, this would use a GeoIP service
    
    # Define alert level based on network zone
    alert_level = "BAIXO" if network_zone != 'external' else "MÉDIO"
    
    return {
        'network_zone': network_zone,
        'country': country,
        'is_internal': network_zone != 'external',
        'is_authorized': network_zone != 'external',
        'alert_level': alert_level,
        'asset_name': f"Host da Rede {network_zone.upper()}" if network_zone != 'external' else None
    }

def calculate_alert_level(ip_info: dict, login_attempts: int, country: str) -> str:
    """Calcula o nível de alerta baseado nas informações do IP e comportamento"""
    
    # Se já é crítico, mantém
    if ip_info["alert_level"] == "CRÍTICO":
        return "CRÍTICO"
    
    # Muitas tentativas de login
    if login_attempts > SECURITY_CONFIG["max_login_attempts"]:
        return "ALTO"
    
    # País de alto risco
    if country in SECURITY_CONFIG["high_risk_countries"]:
        return "ALTO"
    
    # IP não autorizado
    if not ip_info["is_authorized"]:
        return "MÉDIO"
    
    return ip_info["alert_level"] 