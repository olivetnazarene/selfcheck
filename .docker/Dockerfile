# ---- dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---- runtime ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

COPY .docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
