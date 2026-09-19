# BAMIR — Calculadora Definitiva de Venta de Grama

Versión exclusivamente para **venta de grama**, sin instalación.

## Valores iniciales
- Toro: $2.25/m²
- Japonesa: $2.25/m²
- San Agustín: $2.35/m²
- Diésel: $1.40/L
- Navara: 10 L/100 km
- Remolque: $30 cuando supera 55 m²
- Chitré: 206 km
- Los Santos: 210 km
- Las Tablas: 234 km
- Pedasí: 355 km

## Cómo calcula el precio
Costo real = grama + combustible + remolque (si aplica).

Precio recomendado = el mayor entre:
1. precio comercial BAMIR por volumen; y
2. precio necesario para alcanzar el margen objetivo.

La tabla comercial de grama base es:
- Chitré / Los Santos: $4.30, $4.05, $3.95, $3.80, $3.65, $3.50
- Las Tablas: $4.55, $4.30, $4.20, $4.05, $3.90, $3.75
- Pedasí: $4.80, $4.55, $4.45, $4.30, $4.15, $4.00

Los valores pueden modificarse desde Configuración y se guardan localmente en el navegador.

## Publicación
Es un sitio estático. Sube la carpeta a Vercel, Netlify o GitHub Pages, o abre `index.html` directamente.
