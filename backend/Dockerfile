FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --chown=node:node backend/ ./
COPY --chown=node:node database/servidor/ /app/database/servidor/
USER node
EXPOSE 3001
CMD ["sh", "-c", "node scripts/preparar-banco.js && node src/server.js"]
