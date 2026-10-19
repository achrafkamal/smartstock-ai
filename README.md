# SmartStock AI (Ma7alkom - محالكم)

SmartStock AI is an intelligent inventory and stock management application designed for local retail, supermarkets, and stores. It pairs an Express/TypeScript REST API with a modern Expo/React Native mobile application.

---

## 📋 Spécifications & Documentation

- **[Cahier des Charges Fonctionnel et Technique (CdCFT)](file:///c:/Users/pc/Desktop/ma7alkom/smartstock-ai/CAHIER_DES_CHARGES.md)** : Document exhaustif détaillant les besoins fonctionnels, non-fonctionnels, le modèle de données (MCD/ERD), la matrice RBAC, les endpoints d'API et la roadmap de livraison.
- **[Documentation Postman & Tests API](file:///c:/Users/pc/Desktop/ma7alkom/smartstock-ai/postman/README.md)** : Guide d'importation et suites de tests automatisés pour valider chaque endpoint backend.

---

## 🏗️ Project Structure

- `backend/`: Express API, Sequelize models and PostgreSQL database migrations
- `mobile/`: Expo / React Native mobile application (TanStack Query, Zustand, Expo Router)
- `docs/`: Prompts, architecture notes, and Cahier des Charges (`docs/cahier_des_charges.md`)
- `postman/`: Postman collection and environment variables for local testing

---

## 🚀 Backend Setup

Requires Node.js 20 or later and Docker (for PostgreSQL).

1. **Start PostgreSQL database:**
   ```bash
   docker-compose up -d
   ```
2. **Install dependencies:**
   ```bash
   cd backend && npm install
   ```
3. **Configure environment:**
   Copy `.env.example` to `.env` and adjust credentials if needed.
4. **Run migrations & seed:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. **Start development server:**
   ```bash
   npm run dev
   ```
6. **Validate TypeScript:**
   ```bash
   npm run typecheck && npm run build
   ```

*Note on migrations:* The Sequelize migrations target a fresh database. Existing databases created with the former Prisma migrations need a migration baseline or a planned data-preserving migration before running `npm run db:migrate`.

---

## 📱 Mobile App Setup

Requires Node.js and Expo CLI.

1. **Install dependencies:**
   ```bash
   cd mobile && npm install
   ```
2. **Start the Expo development server:**
   ```bash
   npm start # or npx expo start
   ```
3. Open in Android Emulator, iOS Simulator, or via Expo Go on a physical device.

