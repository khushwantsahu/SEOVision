# Node 20 LTS Linux Base Image
FROM node:20-alpine AS base
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Install client dependencies & build frontend bundle
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client/ ./client/
RUN cd client && npm run build

# Copy server code
COPY server/ ./server/

# Move client dist build to server public folder if serving static bundle
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "server.js"]
