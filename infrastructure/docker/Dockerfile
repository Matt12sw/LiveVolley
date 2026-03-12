# Multi-stage build for LiveVolley

# ============================================================================
# BASE IMAGE
# ============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ============================================================================
# DEPENDENCIES
# ============================================================================

FROM base AS deps
RUN npm install -g pnpm@8
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile --prod

# ============================================================================
# BUILDER
# ============================================================================

FROM base AS builder
RUN npm install -g pnpm@8
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# ============================================================================
# API IMAGE
# ============================================================================

FROM base AS api
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/packages/database/node_modules/@prisma ./node_modules/.prisma
COPY --from=builder /app/packages/database/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]

# ============================================================================
# WEB IMAGE
# ============================================================================

FROM base AS web
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
