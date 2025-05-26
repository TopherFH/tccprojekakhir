# Gunakan image Nginx resmi
FROM nginx:alpine

# Hapus config default nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file frontend lo ke direktori web nginx
COPY . /usr/share/nginx/html

# Copy konfigurasi custom nginx kalau mau (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Command default dari Nginx (ga usah diubah)
CMD ["nginx", "-g", "daemon off;"]
