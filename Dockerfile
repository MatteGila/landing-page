# ─── Stage 1: dipendenze produzione ──────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ─── Stage 2: test ───────────────────────────────────────────
FROM node:20-alpine AS tester
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test -- --passWithNoTests

# ─── Stage 3: immagine finale minimale ────────────────────────
FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

COPY --from=deps  --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --chown=appuser:nodejs src/ ./src
COPY --chown=appuser:nodejs package.json ./

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

ENV NODE_ENV=production

CMD ["node", "src/server.js"]