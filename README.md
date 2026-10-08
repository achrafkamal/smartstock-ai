# SmartStock AI

SmartStock AI is a stock management application with an Express/TypeScript API and an Expo mobile app.

## Project Structure

- `backend/`: Express API, Sequelize models and database migrations
- `mobile/`: Expo application
- `docs/`: prompts, architecture notes and API documentation

## Backend

Requires Node.js 20 or later. From `backend/`, install dependencies with `npm install` and configure `.env` using `.env.example`. Run `npm run db:migrate` to create the PostgreSQL tables, then `npm run dev`. To create an administrator, set `ADMIN_PASSWORD` and run `npm run db:seed`. Use `npm run typecheck` and `npm run build` to validate and compile TypeScript.

The Sequelize migrations target a fresh database. Existing databases created with the former Prisma migrations need a migration baseline or a planned data-preserving migration before running `npm run db:migrate`; do not apply the initial Sequelize migrations directly to an existing Prisma-managed database.
