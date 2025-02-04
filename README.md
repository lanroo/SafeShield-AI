# 🛡️ SafeShield AI

Sistema inteligente de detecção e prevenção de ameaças cibernéticas usando IA.

## 📋 Sobre o Projeto

SafeShield AI é uma solução SaaS de cibersegurança voltada para pequenas e médias empresas. O sistema utiliza Machine Learning para detectar acessos suspeitos, prever fraudes e enviar alertas automáticos.

### Principais Funcionalidades

- 🔍 Detecção de ameaças em tempo real
- 🤖 Análise preditiva com IA
- 📊 Dashboard de monitoramento
- 🔔 Sistema de alertas (WhatsApp, Telegram, Email)

## 🏗️ Estrutura do Projeto

```
safeshield/
├── backend/                   # API e lógica principal
│   ├── __init__.py           # Torna backend um módulo Python
│   ├── main.py               # Endpoints da API FastAPI
│   ├── database.py           # Configuração SQLAlchemy
│   ├── models.py             # Modelos do banco de dados
│   ├── schemas.py            # Schemas Pydantic
│   ├── crud.py               # Operações do banco
│   ├── config.py             # Configurações
│   └── requirements.txt      # Dependências
├── frontend/                 # (Futuro) Interface React
├── app.py                    # Ponto de entrada da aplicação
├── run.bat                   # Script de execução (Windows)
├── run.sh                    # Script de execução (Linux/Mac)
└── dev.bat                   # Script de desenvolvimento
```

## 🚀 Rotas da API

### Documentação

- **/**

  - Redireciona para a documentação Swagger
  - Método: GET
  - Uso: Acesso inicial à API

- **/docs**

  - Interface Swagger UI customizada
  - Método: GET
  - Uso: Documentação interativa para testes

- **/redoc**
  - Documentação ReDoc (mais limpa e organizada)
  - Método: GET
  - Uso: Documentação de referência

### Endpoints da API

- **/api/status**

  - Status do sistema
  - Método: GET
  - Retorno: Estado atual do sistema, versão e timestamp
  - Uso: Monitoramento de saúde da API

- **/api/logs**

  - Gerenciamento de logs de acesso
  - Métodos: GET, POST
  - POST: Registra novo log de acesso
  - GET: Lista logs existentes
  - Parâmetros GET: skip (paginação), limit (limite de registros)

- **/api/threats**
  - Consulta de ameaças detectadas
  - Método: GET
  - Retorno: Lista de acessos classificados como ameaças
  - Uso: Monitoramento de segurança

## 🛠️ Tecnologias Utilizadas

- **Backend**
  - FastAPI (framework web)
  - SQLAlchemy (ORM)
  - Pydantic (validação de dados)
  - SQLite/PostgreSQL (banco de dados)

## 🚦 Como Executar

1. **Primeira Execução**

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente (Windows)
.\venv\Scripts\activate

# Instalar dependências e executar
.\dev.bat
```

2. **Execuções Posteriores**

```bash
# Execução normal
.\run.bat

# Ambiente de desenvolvimento
.\dev.bat
```

## 📝 Exemplos de Uso

### Registrar Log de Acesso

```bash
curl -X POST "http://localhost:8000/api/logs" \
     -H "Content-Type: application/json" \
     -d '{
           "ip_address": "192.168.1.100",
           "country": "BR",
           "login_attempts": 3,
           "transaction_value": 1000.50
         }'
```

### Consultar Ameaças

```bash
curl http://localhost:8000/api/threats
```

## 🔐 Segurança

- Autenticação via JWT (em desenvolvimento)
- Validação de dados com Pydantic
- Proteção contra SQL Injection via SQLAlchemy
- Rate limiting (em desenvolvimento)

## 📚 Próximos Passos

1. Implementar autenticação JWT
2. Adicionar sistema de notificações
3. Desenvolver frontend em React
4. Integrar sistema de pagamentos
5. Implementar rate limiting
6. Adicionar mais análises de segurança

## 💡 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📫 Suporte

- Email: suporte@safeshield.ai
- Documentação: https://docs.safeshield.ai
- Chat: https://safeshield.ai/chat

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
