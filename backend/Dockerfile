FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json dulu biar cache npm install jalan
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Buka port 8080
EXPOSE 5000

# Jalankan server dengan perintah npm start
CMD ["npm", "start"]

