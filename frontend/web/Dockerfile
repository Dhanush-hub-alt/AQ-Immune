FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY frontend/web/package.json ./
RUN npm ci --legacy-peer-deps || npm install
COPY . .
WORKDIR /app
RUN npm run build --workspace=frontend/web || npm run build

# Production image
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
