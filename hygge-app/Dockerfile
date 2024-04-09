FROM node:20-alpine AS builder
WORKDIR /hygge-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /hygge-app/dist/hygge-app/browser /usr/share/nginx/html
EXPOSE 80