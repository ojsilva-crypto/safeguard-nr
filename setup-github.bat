@echo off
chcp 65001 >nul
echo ============================================
echo   SafeGuard NR - Setup GitHub
echo ============================================

cd /d C:\safeguard-nr

:: ─── 1. Cria .gitignore ──────────────────────────────────────────
echo Criando .gitignore...
(
echo # Dependencias
echo node_modules/
echo */node_modules/
echo.
echo # Build
echo dist/
echo build/
echo */dist/
echo */build/
echo.
echo # Variaveis de ambiente
echo .env
echo .env.local
echo .env.production
echo backend/.env
echo !.env.example
echo !backend/.env.example
echo.
echo # Logs
echo *.log
echo logs/
echo.
echo # TypeScript
echo *.tsbuildinfo
echo.
echo # Cache
echo .cache/
echo .parcel-cache/
echo .vite/
echo.
echo # Prisma
echo backend/prisma/migrations/
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # IDE
echo .vscode/
echo .idea/
) > .gitignore
echo [OK] .gitignore criado!

:: ─── 2. Cria .env.example na raiz ────────────────────────────────
echo Criando .env.example...
(
echo # ─── App ──────────────────────────────────────────────
echo NODE_ENV=development
echo APP_PORT=3333
echo.
echo # ─── Database ─────────────────────────────────────────
echo DB_USER=safeguard_user
echo DB_PASSWORD=sua_senha_aqui
echo DB_NAME=safeguard_db
echo DB_HOST=postgres
echo DB_PORT=5432
echo.
echo # ─── Redis ────────────────────────────────────────────
echo REDIS_HOST=redis
echo REDIS_PORT=6379
echo REDIS_PASSWORD=sua_senha_redis_aqui
echo.
echo # ─── JWT ──────────────────────────────────────────────
echo JWT_SECRET=seu_jwt_secret_aqui
echo JWT_EXPIRES_IN=7d
echo.
echo # ─── Frontend ─────────────────────────────────────────
echo VITE_API_URL=http://localhost/api
) > .env.example
echo [OK] .env.example criado!

:: ─── 3. Cria README.md ───────────────────────────────────────────
echo Criando README.md...
(
echo # SafeGuard NR
echo.
echo Plataforma de Gestao de Seguranca do Trabalho e Compliance NR-1.
echo.
echo ## Stack
echo.
echo - **Frontend**: React + TypeScript + Vite + Tailwind CSS
echo - **Backend**: Node.js + Express + Prisma + PostgreSQL
echo - **Infra**: Docker + Docker Compose + Nginx
echo.
echo ## Como rodar
echo.
echo ### Pre-requisitos
echo - Docker Desktop instalado
echo - Git
echo.
echo ### 1. Clone o repositorio
echo ```bash
echo git clone https://github.com/SEU_USUARIO/safeguard-nr.git
echo cd safeguard-nr
echo ```
echo.
echo ### 2. Configure as variaveis de ambiente
echo ```bash
echo cp .env.example .env
echo # Edite o .env com suas configuracoes
echo ```
echo.
echo ### 3. Suba os containers
echo ```bash
echo docker-compose up -d
echo ```
echo.
echo ### 4. Rode as migrations
echo ```bash
echo docker exec safeguard-backend npx prisma migrate dev
echo docker exec safeguard-backend npx prisma db seed
echo ```
echo.
echo ### 5. Acesse
echo - Frontend: http://localhost
echo - Backend API: http://localhost/api
echo.
echo ## Login padrao
echo.
echo - Email: admin@safeguard.com
echo - Senha: admin123
echo.
echo ## Estrutura
echo.
echo ```
echo safeguard-nr/
echo ├── frontend/        # React + Vite
echo ├── backend/         # Node.js + Prisma
echo ├── nginx/           # Proxy reverso
echo ├── docker-compose.yml
echo └── .env.example
echo ```
) > README.md
echo [OK] README.md criado!

:: ─── 4. Verifica se backend e frontend existem ───────────────────
echo.
echo Verificando estrutura de pastas...
if not exist "backend\" (
    echo [AVISO] Pasta backend/ nao encontrada!
) else (
    echo [OK] backend/ encontrado
)
if not exist "frontend\" (
    echo [AVISO] Pasta frontend/ nao encontrada!
) else (
    echo [OK] frontend/ encontrado
)
if not exist "nginx\" (
    echo [AVISO] Pasta nginx/ nao encontrada!
) else (
    echo [OK] nginx/ encontrado
)

:: ─── 5. Git add + commit + push ──────────────────────────────────
echo.
echo Adicionando arquivos ao Git...
git add .

echo.
echo Fazendo commit...
git commit -m "feat: estrutura completa do projeto SafeGuard NR

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + Express + Prisma
- Docker Compose com PostgreSQL, Redis e Nginx
- Paginas: Dashboard, Riscos, PGR, Colaboradores, Compliance
- Autenticacao JWT"

echo.
echo Enviando para o GitHub...
git push origin main

echo.
echo ============================================
echo   CONCLUIDO! Projeto no GitHub!
echo ============================================
echo.
echo Acesse seu repositorio no GitHub para confirmar.
echo.
pause
