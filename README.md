# 🏐 LiveVolley Platform

Plateforme moderne de streaming et suivi de matches de volleyball en direct.

## 📋 Vue d'ensemble

LiveVolley est une plateforme complète proposant:
- **Streaming en direct** avec qualité adaptative (HLS)
- **Suivi des scores** en temps réel via WebSocket
- **Chat en direct** avec modération
- **Gestion de clubs et équipes**
- **Dashboard admin** complet
- **Notifications** push et emails

## 🏗️ Architecture

### Structure du projet

```
site-volley-platform
├── apps/              # Applications exécutables
│   ├── web/          # Frontend public (Next.js)
│   ├── api/          # Backend API (NestJS)
│   └── admin/        # Dashboard admin
├── packages/         # Code partagé
│   ├── database/     # Prisma ORM
│   ├── types/        # Types TypeScript partagés
│   ├── ui/           # Composants React réutilisables
│   └── config/       # Configurations ESLint/TS
├── infrastructure/   # Déploiement
│   ├── docker/
│   ├── terraform/
│   └── scripts/
└── docs/             # Documentation technique
```

### Couches d'architecture

```
Frontend (Next.js)
       ↓
   API REST/WebSocket
       ↓
    Services Backend
       ↓
   Base de données (PostgreSQL)
       ↓
Stockage / Streaming (S3 / RTMP)
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18
- pnpm >= 8
- Docker (optionnel)

### Installation

```bash
# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env.local

# Générer le client Prisma
pnpm db:generate

# Démarrer le mode développement
pnpm dev
```

## 📦 Apps

### Web (Frontend)
- **Framework**: Next.js 14+
- **Styling**: TailwindCSS
- **State**: Zustand + React Query
- **Real-time**: WebSocket (Socket.io)
- **Localisation**: i18n

### API (Backend)
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma
- **Real-time**: WebSocket
- **WebRTC**: Pour le streaming
- **Queue**: Bull (Redis)
- **Auth**: JWT + OAuth2

### Admin (Dashboard)
- **Framework**: Next.js 14+
- **Admin Template**: Shadcn/ui
- **Charts**: Recharts / Chart.js
- **Table**: TanStack Table

## 📚 Packages

### `@live-volley/database`
Schéma Prisma et migrations de la base de données.

### `@live-volley/types`
Types TypeScript partagés entre frontend et backend.

### `@live-volley/ui`
Composants React réutilisables (buttons, cards, modals, etc.).

### `@live-volley/config`
Configurations ESLint, TypeScript et autres outils.

## 🔐 Sécurité

- **CORS** proprement configuré
- **Rate limiting** sur les endpoints
- **Validation** des inputs
- **JWT** pour l'authentification
- **WebSocket authentication**
- **Encryption** des données sensibles

## 📊 Base de données

Schéma Prisma inclus dans `packages/database`:
- Users / Authentification
- Clubs / Teams / Players
- Matches / Competitions
- Scores / Stats
- Chat / Messages
- Notifications

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 🔄 CI/CD

Les workflows GitHub Actions sont configurés pour:
- Linting et formatting
- Type checking
- Tests
- Build
- Déploiement automatique

## 📖 Documentation

- [Architecture détaillée](./docs/architecture)
- [Schéma BD](./docs/database)
- [Streaming RTMP/HLS](./docs/streaming)
- [Sécurité](./docs/security)

## 🛠️ Scripts disponibles

```bash
# Développement
pnpm dev              # Démarrer tous les apps en mode dev
pnpm build            # Builder le projet complet
pnpm lint             # Linter tout le code
pnpm format           # Formater avec Prettier
pnpm type-check       # Vérifier les types TypeScript
pnpm test             # Exécuter les tests

# Prisma
pnpm db:push          # Pusher le schema à la BD
pnpm db:generate      # Générer le client Prisma
pnpm db:migrate       # Exécuter les migrations
```

## 🌐 Déploiement

### Docker
```bash
docker-compose up -d
```

### Terraform
```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

## 📝 Contributions

1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous license MIT - voir le fichier LICENSE pour plus de détails.

## 👥 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**LiveVolley Platform** - Construit avec ❤️ pour les passionnés de volleyball
