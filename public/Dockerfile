# Imagen oficial de PHP con Apache
FROM php:8.2-apache

# Habilitar módulos de Apache necesarios (rewrite suele ser necesario)
RUN a2enmod rewrite

# Copiar archivos de tu proyecto al servidor web
COPY . /var/www/html/

# Dar permisos correctos al proyecto
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["apache2-foreground"]
