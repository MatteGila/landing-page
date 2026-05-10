# ─── Stage 1: dipendenze produzione ──────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ─── Stage 2: test (non finisce nell'immagine finale) ─────────
FROM node:20-alpine AS tester
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test

# ─── Stage 3: immagine finale minimale ────────────────────────
FROM node:20-alpine AS runner

# Utente non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

# Copia solo il necessario
COPY --from=deps  --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --chown=appuser:nodejs src/ ./src
COPY --chown=appuser:nodejs package.json ./

USER appuser

EXPOSE 3000

# Health check integrato nel container
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
