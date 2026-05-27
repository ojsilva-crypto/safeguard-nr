# SafeGuard NR

Plataforma de Gestao de Seguranca do Trabalho e Compliance NR-1.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Infra**: Docker + Docker Compose + Nginx

## Como rodar

### Pre-requisitos
- Docker Desktop instalado
- Git

### 1. Clone o repositorio
```bash
git clone https://github.com/SEU_USUARIO/safeguard-nr.git
cd safeguard-nr
```

### 2. Configure as variaveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas configuracoes
```

### 3. Suba os containers
```bash
docker-compose up -d
```

### 4. Rode as migrations
```bash
docker exec safeguard-backend npx prisma migrate dev
docker exec safeguard-backend npx prisma db seed
```

### 5. Acesse
- Frontend: http://localhost
- Backend API: http://localhost/api

## Login padrao

- Email: admin@safeguard.com
- Senha: admin123

## Estrutura

```
safeguard-nr/
├── frontend/        # React + Vite
├── backend/         # Node.js + Prisma
├── nginx/           # Proxy reverso
├── docker-compose.yml
└── .env.example
```
