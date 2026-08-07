FROM node:20-alpine AS build

WORKDIR /app

COPY src/backend/package*.json ./src/backend/
COPY src/frontend/package*.json ./src/frontend/

RUN cd src/backend && npm ci
RUN cd src/frontend && npm ci

COPY src/backend ./src/backend
COPY src/frontend ./src/frontend
COPY src/db ./src/db

RUN cd src/frontend && npm run build

FROM node:20-alpine

WORKDIR /app/src/backend

ENV NODE_ENV=production

COPY --from=build /app/src/backend ./
COPY --from=build /app/src/backend/node_modules ./node_modules
COPY --from=build /app/src/frontend/dist ../frontend/dist
COPY --from=build /app/src/db ../db

EXPOSE 3001

CMD ["node", "server.js"]