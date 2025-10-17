FROM node:22-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/web/package.json apps/web/package.json
COPY --from=builder /app/out/json/ ./
RUN yarn install --frozen-lockfile
COPY --from=builder /app/out/full/ ./
RUN yarn turbo run build --filter=web

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 viteuser
USER viteuser

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=installer /app/apps/web/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]