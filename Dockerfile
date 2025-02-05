FROM python:3.11-slim

WORKDIR /app

# Copiar arquivos de dependências
COPY requirements.txt .
COPY backend/requirements.txt backend/

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copiar o código do backend
COPY backend/ backend/
COPY app.py .

# Copiar o script de entrada e torná-lo executável
COPY backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expor a porta
EXPOSE 8002

# Usar o script de entrada como ponto de entrada
ENTRYPOINT ["/app/docker-entrypoint.sh"] 