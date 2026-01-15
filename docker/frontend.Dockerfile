FROM node:18-alpine AS build
WORKDIR /usr/src/app

# 1. Copy dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# --- FIX 1: PERMANENT API URL CONFIG ---
# We hardcode this to /api so it always works with the Nginx Reverse Proxy.
# You no longer need to pass --build-arg when running docker build.
ENV REACT_APP_API_URL=/api

# --- FIX 2: Disable Strict Linting ---
ENV DISABLE_ESLINT_PLUGIN=true
# -----------------------------------------------------------------------

# Build the React app
RUN npm run build

# Nginx Stage
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# --- FIX 3: Nginx Config for React Router ---
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
# ------------------------------------------

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]