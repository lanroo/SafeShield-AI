# Versão simplificada sem scikit-learn por enquanto
def predict_threat(log_data):
    """
    Versão simplificada do detector de ameaças
    """
    threat_score = 0.0
    
    # Regras básicas
    if log_data.login_attempts > 3:
        threat_score += 0.4
        
    if log_data.transaction_value and log_data.transaction_value > 10000:
        threat_score += 0.3
        
    # Lista de países de alto risco (exemplo)
    high_risk_countries = ['XX', 'YY', 'ZZ']  # Substitua pelos países reais
    if log_data.country in high_risk_countries:
        threat_score += 0.3
        
    return min(threat_score, 1.0) 