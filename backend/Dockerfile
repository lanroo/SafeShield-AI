FROM python:3.11-slim

WORKDIR /app

# Instalar dependências
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY app.py .
COPY backend backend/

# Adicionar o diretório ao PYTHONPATH
ENV PYTHONPATH=/app

# Expor porta
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["python", "app.py"] 