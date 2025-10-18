FROM node:22.20.0-alpine AS builder
WORKDIR /docker/app
COPY . .
RUN npm install
RUN npx turbo run build --filter=auth-service
CMD ["node", "apps/auth-service/dist/main.js"]
