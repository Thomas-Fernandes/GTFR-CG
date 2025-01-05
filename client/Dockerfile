FROM node:23 AS build

WORKDIR /frontend

COPY package.json ./
RUN npm install --global pnpm && pnpm self-update && pnpm install

COPY . .
RUN pnpm build

# Base image for serving the app
FROM nginx:alpine
COPY --from=build /frontend/dist /usr/share/nginx/html

EXPOSE 4242
