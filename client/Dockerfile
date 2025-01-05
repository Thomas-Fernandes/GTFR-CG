FROM node:23 AS build

WORKDIR /frontend

COPY package.json ./
RUN npm install --global pnpm && pnpm self-update && pnpm install

COPY . .
RUN pnpm build

EXPOSE 4242
CMD ["pnpm", "run", "expose"]