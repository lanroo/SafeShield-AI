#!/bin/sh

set -e

# Função para verificar o PostgreSQL
check_postgres() {
    echo "Verificando conexão com PostgreSQL..."
    python -c "
import psycopg2
try:
    conn = psycopg2.connect('postgresql://postgres:postgres@db:5432/safeshield')
    conn.close()
    print('PostgreSQL está pronto!')
    exit(0)
except Exception as e:
    print(f'Erro ao conectar ao PostgreSQL: {e}')
    exit(1)
"
}

# Esperar pelo PostgreSQL
echo "Aguardando PostgreSQL..."
for i in $(seq 1 30); do
    if check_postgres; then
        break
    fi
    echo "Tentativa $i de 30. Aguardando 1 segundo..."
    sleep 1
done

# Verificar se conseguiu conectar
if ! check_postgres; then
    echo "Não foi possível conectar ao PostgreSQL após 30 tentativas"
    exit 1
fi

# Inicializar banco de dados
echo "Inicializando banco de dados..."
python -c "
from backend.init_db import init_db
try:
    init_db()
    print('Banco de dados inicializado com sucesso!')
except Exception as e:
    print(f'Erro ao inicializar banco de dados: {e}')
    exit(1)
"

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec uvicorn backend.app:app --host 0.0.0.0 --port 8002 