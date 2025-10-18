FROM node:22.20.0-alpine AS builder
WORKDIR /docker/app
COPY . .
RUN npm install
RUN npx turbo run build --filter=tasks-service
CMD ["node", "apps/tasks-service/dist/main.js"]
