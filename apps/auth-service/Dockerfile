FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY apps/auth-service/package.json ./apps/auth-service/package.json
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build --workspace=apps/auth-service
EXPOSE 3002
CMD ["node", "apps/auth-service/dist/main.js"]
