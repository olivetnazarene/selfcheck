# ---- server deps ----
FROM node:20-alpine AS server_deps
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---- client build ----
FROM node:20-alpine AS client_build
WORKDIR /app/client

COPY client/package.json ./
COPY client/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY client/ ./
RUN npm run build

# ---- runtime ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=server_deps /app/node_modules ./node_modules
COPY . .
COPY --from=client_build /app/client/build ./client/build

COPY .docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
