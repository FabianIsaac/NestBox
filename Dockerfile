# Etapa de compilación
FROM node:18-alpine AS build

WORKDIR /app

# Instalar las dependencias y el CLI de NestJS globalmente
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli

COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar el build y reinstalar las dependencias de producción
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production
RUN npm install -g @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start:dev"]