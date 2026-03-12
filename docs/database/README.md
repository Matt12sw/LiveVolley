# 🗄️ Database Schema

## Overview

La base de données PostgreSQL pour LiveVolley est gérée avec **Prisma ORM**.

## Schéma Prisma

Voir `packages/database/schema.prisma` pour le schéma complet.

## Tables principales

### Users
- `id` (PK)
- `email` (UNIQUE)
- `username` (UNIQUE)
- `password`
- `displayName`
- `avatar`
- `role` (ADMIN, MODERATOR, COACH, PLAYER, SPECTATOR, USER)
- `status` (ACTIVE, INACTIVE, BANNED, SUSPENDED)
- Timestamps

### Clubs
- `id` (PK)
- `name`
- `slug` (UNIQUE)
- `logo`
- `banner`
- `city`, `country`
- `foundedYear`
- Timestamps

### Teams
- `id` (PK)
- `name`
- `slug` (UNIQUE)
- `clubId` (FK)
- `logo`
- `color`
- `coach`
- Timestamps

### Matches
- `id` (PK)
- `title`
- `slug` (UNIQUE)
- `competitionId` (FK)
- `homeTeamId` (FK)
- `awayTeamId` (FK)
- `scheduledAt`
- `status` (SCHEDULED, LIVE, PAUSED, COMPLETED, CANCELLED)
- `streamingUrl`
- `rtmpKey`
- Timestamps

### Scores
- `id` (PK)
- `matchId` (FK)
- `homeTeamScore`
- `awayTeamScore`
- `set`
- `scoredById` (FK)
- Timestamps

### Chat & Messages
- `Chat` (UNIQUE per match)
- `ChatMessage` (messages)
- `ChatReaction` (emoji reactions)
- `ChatModerator` (permissions)

### Streaming
- `id` (PK)
- `matchId` (FK, UNIQUE)
- `status` (SETUP, LIVE, RECORDING, COMPLETED, FAILED)
- `viewers`
- `hlsPlayback`, `rtmpIngestion`
- `recordingUrl`
- Timestamps

## Relations

```
User
  ├── TeamMember (1:N)
  ├── ClubMember (1:N)
  ├── Match (1:N as creator)
  ├── ChatMessage (1:N)
  ├── Notification (1:N)
  └── Score (1:N as scorer)

Club
  ├── Team (1:N)
  ├── ClubMember (1:N)
  └── Competition (1:N)

Team
  ├── TeamMember (1:N)
  ├── Match (1:N as homeTeam)
  ├── Match (1:N as awayTeam)
  └── CompetitionTeam (1:N)

Match
  ├── Score (1:N)
  ├── Chat (1:1)
  ├── Streaming (1:1)
  └── Competition (N:1)

Chat
  ├── ChatMessage (1:N)
  ├── ChatReaction (1:N)
  └── ChatModerator (1:N)
```

## Indices

Indices pour optimiser les requêtes:
- `users(email, username, status)`
- `matches(competitionId, homeTeamId, awayTeamId, status)`
- `scores(matchId, createdAt)`
- `chatmessages(chatId, userId, createdAt)`
- `notifications(userId, read)`

## Migrations

```bash
# Créer une migration
pnpm db:migrate create init

# Appliquer les migrations
pnpm db:migrate deploy

# Voir l'état des migrations
pnpm db:migrate status
```

## Prisma Client Usage

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Récupérer un match avec scores et teams
const match = await prisma.match.findUnique({
  where: { id: matchId },
  include: {
    scores: true,
    homeTeam: true,
    awayTeam: true,
    streaming: true,
  },
});

// Mise à jour d'score
await prisma.score.create({
  data: {
    matchId,
    homeTeamScore: 25,
    awayTeamScore: 20,
    set: 1,
  },
});
```

## Seeding

```bash
# Seed la base de données
pnpm db:seed
```

Voir `packages/database/seed.ts` pour les données de test.

## Performance

### Query Optimization
- Relation loading selectif avec `select` et `include`
- Pagination avec `skip`/`take`
- Index sur les colonnes de recherche fréquente
- Caching avec Redis pour les données chaudes

### Connexion Pooling
- PrismaClient utilise automatic connection pooling
- Max connections configuré via DATABASE_URL

## Backup & Disaster Recovery

### Backup Strategy
```bash
# Export de la base complète
pg_dump postgresql://user:password@localhost:5432/live_volley > backup.sql

# Restauration
psql postgresql://user:password@localhost:5432/live_volley < backup.sql
```

## Maintenance

### Vacuum & Analyze
```bash
# Optimiser la base de données
VACUUM ANALYZE;
```

### Monitoring
- CPU/Memory usage
- Connexions actives
- Slow queries
- Disk space
