# build application
FROM node:18-slim AS builder
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# run application
FROM node:18-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/.env .env
RUN npm ci --omit=dev
EXPOSE 8000
CMD ["node", "build/server.js"]
