# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_* 변수는 빌드 시점에 번들에 포함되므로 ARG → ENV로 전달
ARG VITE_BACKSERVER
ARG VITE_NAVER_MAP_KEY
ARG VITE_GREEN_RETURN_API_KEY

ENV VITE_BACKSERVER=$VITE_BACKSERVER
ENV VITE_NAVER_MAP_KEY=$VITE_NAVER_MAP_KEY
ENV VITE_GREEN_RETURN_API_KEY=$VITE_GREEN_RETURN_API_KEY

RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
