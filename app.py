import os
import uvicorn
from backend.app import app as backend_app

def start_backend():
    """Inicia o servidor backend FastAPI"""
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)

def main():
    """Função principal para iniciar a aplicação"""
    print("🛡️ Iniciando SafeShield AI...")
    print("📊 Backend API: http://localhost:8000")
    print("📚 Documentação: http://localhost:8000/docs")
    
    # Inicia o backend
    start_backend()

if __name__ == "__main__":
    main()
