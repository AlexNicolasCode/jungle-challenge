FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build --workspace=apps/api-gateway
EXPOSE 3001
CMD ["node", "apps/api-gateway/dist/main.js"]
