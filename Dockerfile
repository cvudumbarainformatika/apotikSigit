# Stage 1: Build dengan Node
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json & lockfile
COPY package*.json ./

# Install deps
RUN npm ci

# Copy seluruh source
COPY . .

# Build production
RUN npm run build

# Stage 2: Nginx untuk serve file static
FROM nginx:stable-alpine

# Install curl (untuk debug)
RUN apk update && apk add --no-cache curl

# Hapus default config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
