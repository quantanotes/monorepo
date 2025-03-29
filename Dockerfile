FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/agent/package.json ./packages/agent/
COPY packages/auth/package.json ./packages/auth/
COPY packages/cache/package.json ./packages/cache/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/

RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY apps/web ./apps/web
COPY packages/agent ./packages/agent
COPY packages/auth ./packages/auth
COPY packages/cache ./packages/cache
COPY packages/db ./packages/db
COPY packages/types ./packages/types
COPY packages/ui ./packages/ui
COPY packages/utils ./packages/utils

COPY .env ./

WORKDIR /app/apps/web
RUN bunx vite build

FROM oven/bun:latest AS production

WORKDIR /app

COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "build/index.js"]