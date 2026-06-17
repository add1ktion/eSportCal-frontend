# frontend/Dockerfile
# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS build-stage

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (required for building)
RUN npm ci

# Copy application source code
COPY . .

# Build the static assets for production (Vite outputs to 'dist')
RUN npm run build

# --- Stage 2: Serve the Static Assets using Nginx ---
FROM nginx:alpine

# Copy custom Nginx config to support React client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from stage 1 to Nginx directory
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
