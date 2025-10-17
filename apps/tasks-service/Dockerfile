FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY apps/tasks-service/package.json ./apps/tasks-service/package.json
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build --workspace=apps/tasks-service
EXPOSE 3003
CMD ["node", "apps/tasks-service/dist/main.js"]
