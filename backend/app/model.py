from .schemas import AccessLogCreate

def predict_threat(log: AccessLogCreate) -> float:
    """
    Modelo simples de predição de ameaças
    Retorna um score de 0 a 1
    """
    threat_score = 0.0
    
    # Lógica básica de detecção
    if log.login_attempts > 5:
        threat_score += 0.5
    if log.transaction_value > 10000:
        threat_score += 0.3
        
    return min(threat_score, 1.0) 