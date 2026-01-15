FROM node:18-alpine
WORKDIR /app

# 1. Copy dependencies (Updated path)
COPY package*.json ./
RUN npm install

# 2. Copy source code (Updated path)
COPY . .

# Security: Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000
CMD ["npm", "start"]