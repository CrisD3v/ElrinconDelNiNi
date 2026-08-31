FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/client/package.json ./apps/client/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile --filter @elrincondelnini/web...

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @elrincondelnini/web build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/apps/client/public ./public
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
EXPOSE 3000
CMD ["node", "apps/client/server.js"]
