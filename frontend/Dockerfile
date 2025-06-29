# Step 1: Build the React app
FROM node:24.3.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Accept build-time environment variables
ARG VITE_LOGIN_API_URL
ARG VITE_LOGIN_PORT
ARG VITE_PAYMENT_API_URL
ARG VITE_PAYMENT_PORT
ARG VITE_BOOKING_API_URL
ARG VITE_BOOKING_PORT

# These will be picked up by Vite if defined as VITE_*
ENV VITE_LOGIN_API_URL=$VITE_LOGIN_API_URL
ENV VITE_LOGIN_PORT=$VITE_LOGIN_PORT
ENV VITE_PAYMENT_API_URL=$VITE_PAYMENT_API_URL
ENV VITE_PAYMENT_PORT=$VITE_PAYMENT_PORT
ENV VITE_BOOKING_API_URL=$VITE_BOOKING_API_URL
ENV VITE_BOOKING_PORT=$VITE_BOOKING_PORT

RUN npm run build

# Step 2: Serve with NGINX (latest Alpine, possibly patched)
FROM nginx:stable-alpine3.20  

# (Optional) Force apk update to get fixed packages
RUN apk update && apk upgrade --no-cache

COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional) Use custom NGINX config for React Router
# COPY nginx.conf /etc/nginx/conf.d/default.conf
