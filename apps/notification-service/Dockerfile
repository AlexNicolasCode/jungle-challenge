FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY apps/notification-service/package.json ./apps/notification-service/package.json
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build --workspace=apps/notification-service
EXPOSE 3004
CMD ["node", "apps/notification-service/dist/main.js"]
