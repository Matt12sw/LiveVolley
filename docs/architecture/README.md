# 🏗️ Architecture de LiveVolley

## Vue d'ensemble

LiveVolley est construit selon une architecture en monorepo utilisant **Turbo**, **pnpm** et une séparation claire entre les applications et packages partagés.

## Structure en couches

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js)                  │
│   - Web Public                              │
│   - Admin Dashboard                         │
└─────────────┬───────────────────────────────┘
              │ HTTP/REST + WebSocket
┌─────────────────────────────────────────────┐
│         Backend API (NestJS)                │
│   - Auth/Users                              │
│   - Matches/Scores                          │
│   - Streaming Gateway                       │
│   - Chat/Messaging                          │
│   - Notifications                           │
└─────────────┬───────────────────────────────┘
              │
      ┌───────┴─────────┬────────────┐
      │                 │            │
┌──────────────┐  ┌──────────┐  ┌─────────┐
│  PostgreSQL  │  │  Redis   │  │ S3/HLS  │
│  (Data)      │  │ (Cache)  │  │ (Media) │
└──────────────┘  └──────────┘  └─────────┘
```

## Modules Backend

### Auth (`apps/api/src/modules/auth`)
- Authentification JWT
- OAuth2 (Google, GitHub)
- Refresh tokens
- Two-factor authentication (2FA)

### Users (`apps/api/src/modules/users`)
- Gestion des profils utilisateurs
- Roles and permissions
- User preferences
- Account management

### Clubs (`apps/api/src/modules/clubs`)
- Gestion des clubs de volleyball
- Affiliations et memberships
- Gestion des équipes

### Teams (`apps/api/src/modules/teams`)
- Gestion des équipes
- Roster management
- Team statistics

### Players (`apps/api/src/modules/players`)
- Profils des joueurs
- Statistiques individuelles
- Performance tracking

### Competitions (`apps/api/src/modules/competitions`)
- Gestion des compétitions
- Tournois et saisons
- Calendrier des matchs

### Matches (`apps/api/src/modules/matches`)
- Création et gestion des matchs
- Scheduling
- Match details

### Streaming (`apps/api/src/modules/streaming`)
- Gestion du streaming en direct
- RTMP ingestion
- HLS distribution
- Viewer count tracking

### Score (`apps/api/src/modules/score`)
- Gestion des scores en temps réel
- Mise à jour des points
- Historique des scores
- Review/validation des scores

### Chat (`apps/api/src/modules/chat`)
- Chat en direct pendant les matchs
- Modération
- Rate limiting
- Message persistence

### Moderation (`apps/api/src/modules/moderation`)
- Report management
- User moderation
- Content filtering
- Ban/Mute management

### Notifications (`apps/api/src/modules/notifications`)
- Push notifications
- Email notifications
- In-app notifications
- Notification preferences

### Admin (`apps/api/src/modules/admin`)
- Admin dashboard backend
- Analytics
- System management
- User management

## Frontend

### Structures

**Web (apps/web)**
```
src/
├── app/              # Pages Next.js
├── components/       # Composants réutilisables
├── features/         # Domains spécifiques
│   ├── auth/
│   ├── matches/
│   ├── live/
│   ├── chat/
│   └── score/
├── hooks/            # Custom React hooks
├── services/         # API clients
└── styles/           # Styles globaux
```

**Admin (apps/admin)**
```
src/
├── app/              # Pages dashboard
├── components/       # UI components
├── features/         # Admin features
│   ├── users/
│   ├── clubs/
│   ├── matches/
│   ├── analytics/
│   └── moderation/
```

## Packages partagés

### `@live-volley/types`
Types TypeScript partagés utilisés dans frontend et backend.

### `@live-volley/ui`
Composants React réutilisables avec TailwindCSS.

### `@live-volley/database`
Schéma Prisma ORM et migrations.

### `@live-volley/config`
Configurations ESLint, TypeScript et autres outils.

## Communication Real-time

### WebSocket Events

**Match Score Update**
```ts
{
  event: "score:update",
  data: {
    matchId: "...",
    homeTeamScore: 25,
    awayTeamScore: 20,
    set: 1
  }
}
```

**Chat Message**
```ts
{
  event: "chat:message",
  data: {
    chatId: "...",
    userId: "...",
    content: "GG!",
    createdAt: "2024-03-12T..."
  }
}
```

**Streaming Status**
```ts
{
  event: "streaming:status",
  data: {
    matchId: "...",
    status: "LIVE",
    viewers: 1250
  }
}
```

## Cache Strategy

- **Redis** pour:
  - Session storage
  - Real-time match data
  - Chat messages (last N)
  - Viewer count
  - Rate limiting

- **PostgreSQL** pour:
  - Persistent data
  - Historical data
  - User data
  - Analytics

## Security

- CORS sécurisé
- JWT token-based auth
- Rate limiting par IP/User
- Input validation (Validation pipes)
- HTTPS en production
- WebSocket authentication
- SQL injection prevention (Prisma ORM)

## Deployment

### Docker Compose (Development/Staging)
```bash
docker-compose up -d
```

### Production (Kubernetes/Cloud)
- API: Container orchestration
- Database: Managed PostgreSQL
- Cache: Managed Redis
- Streaming: CDN + HLS distribution

## Monitoring & Logging

- Application logs → ELK Stack
- Error tracking → Sentry
- Performance monitoring → New Relic/DataDog
- Streaming metrics → Custom dashboard

## CI/CD

GitHub Actions workflows:
- Lint & Format
- Type checking
- Tests
- Build
- Deploy
