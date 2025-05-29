# Gunakan Node.js versi stabil
FROM node:20-alpine

# Set direktori kerja
WORKDIR /app

# Salin file package dan install dependencies
COPY package*.json ./
RUN npm install --production

# Salin seluruh project
COPY . .

# Ekspos port (harus sama dengan PORT di .env)
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "index.js"]
