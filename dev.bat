@echo off
echo 🛡️ Iniciando ambiente de desenvolvimento...

REM Ativa o ambiente virtual
call venv\Scripts\activate

REM Instala/atualiza dependências
cd backend
pip install -r requirements.txt
cd ..

REM Inicia a aplicação
python app.py 