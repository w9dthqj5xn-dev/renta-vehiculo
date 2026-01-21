"""
Script para generar iconos básicos para la PWA
Requiere Pillow: pip install Pillow
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Crear directorio de iconos si no existe
os.makedirs('static/icons', exist_ok=True)

# Tamaños de iconos necesarios
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Colores del tema
bg_color = (30, 60, 114)  # #1e3c72
text_color = (255, 255, 255)

for size in sizes:
    # Crear imagen con fondo del color del tema
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Dibujar un círculo blanco
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill=(42, 82, 152), outline=text_color, width=max(2, size // 50))
    
    # Dibujar icono de carro simple
    car_width = size // 2
    car_height = size // 4
    car_x = (size - car_width) // 2
    car_y = (size - car_height) // 2
    
    # Cuerpo del carro
    draw.rectangle([car_x, car_y, car_x + car_width, car_y + car_height], 
                   fill=text_color)
    
    # Ruedas
    wheel_radius = size // 16
    draw.ellipse([car_x + wheel_radius, car_y + car_height - wheel_radius, 
                  car_x + wheel_radius * 3, car_y + car_height + wheel_radius], 
                 fill=text_color)
    draw.ellipse([car_x + car_width - wheel_radius * 3, car_y + car_height - wheel_radius, 
                  car_x + car_width - wheel_radius, car_y + car_height + wheel_radius], 
                 fill=text_color)
    
    # Guardar imagen
    filename = f'static/icons/icon-{size}x{size}.png'
    img.save(filename, 'PNG')
    print(f'✓ Creado: {filename}')

print('\n✅ Todos los iconos han sido generados exitosamente!')
print('\n📝 Para personalizar los iconos:')
print('1. Crea tu diseño en 512x512 px')
print('2. Usa herramientas como:')
print('   - https://realfavicongenerator.net/')
print('   - https://www.pwabuilder.com/')
print('3. Reemplaza los archivos en static/icons/')
