# Usa Node.js como base
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copia el código al contenedor
COPY backend/ /app/

# Instala las dependencias
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "app.js"]
