# Step 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Build Backend & Production Image
FROM node:20-alpine
WORKDIR /app

# Install build tools for better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm install --only=production

COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "backend/src/index.js"]
