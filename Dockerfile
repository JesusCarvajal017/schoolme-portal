# =========================================
# Etapa 1: construir la app Angular
# =========================================
FROM node:20 AS build
WORKDIR /app

# Copiar package.json y package-lock.json y hacer install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar todo el proyecto
COPY . .

# Construir la app Angular para producción
RUN npx ng build security --configuration production

# =========================================
# Etapa 2: servir la app con Nginx
# =========================================
FROM nginx:stable-alpine

# Copiar los archivos de Angular a Nginx
COPY --from=build /app/dist/security /usr/share/nginx/html

# 🔹 Mover archivos dentro de 'browser/' a la raíz para que index.html los encuentre
RUN mv /usr/share/nginx/html/browser/* /usr/share/nginx/html/ && rm -rf /usr/share/nginx/html/browser

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 dentro del contenedor
EXPOSE 80

# Arrancar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
