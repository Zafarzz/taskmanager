# PlanJet (Task Manager)

Monorepo for PlanJet — a Telegram Mini App + Bot task and project manager.

## Structure

- `frontend/` — React + TypeScript + Vite + Tailwind CSS Telegram Mini App
- `backend/` — NestJS + Prisma (PostgreSQL) + GramJS Telegram Bot API
- `docker-compose.yml` — Local PostgreSQL database

## Local Setup

1. Install dependencies from the repository root:
   ```bash
   npm install
   ```

2. Configure environment files:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`

3. Start PostgreSQL and run Prisma migrations:
   ```bash
   npm run db:up
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Start both apps in development mode:
   ```bash
   npm run dev
   ```

## Individual Scripts

- `npm run dev:backend` / `npm run dev:frontend`
- `npm run build` (`build:backend` + `build:frontend`)
- `npm run lint:backend` / `npm run lint:frontend`
