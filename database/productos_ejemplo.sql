-- TechStore | Datos de ejemplo para PostgreSQL
-- Proyecto catalogo-productos (Spring Boot + Spring Data JPA)
--
-- INSTRUCCIONES:
-- 1. Crear la base de datos catalogo_productos si no existe.
-- 2. Arrancar Spring Boot una vez: Hibernate creara public.productos
--    (spring.jpa.hibernate.ddl-auto=update).
-- 3. Abrir el Query Tool de la base catalogo_productos en pgAdmin.
-- 4. Ejecutar el contenido de este archivo.
--
-- No elimina ni modifica productos existentes. Puede ejecutarse varias veces:
-- ignora nombres que ya existan sin distinguir mayusculas/minusculas.
-- Las rutas de imagen corresponden a archivos presentes en
-- src/main/resources/static/img/ del repositorio.

BEGIN;

INSERT INTO public.productos
    (nombre, descripcion, precio, categoria, imagen_url, stock)
SELECT
    demo.nombre,
    demo.descripcion,
    demo.precio,
    demo.categoria,
    demo.imagen_url,
    demo.stock
FROM (
    VALUES
        ('Laptop Lenovo IdeaPad',
         'Laptop con 16 GB de RAM y SSD de 512 GB',
         750.00, 'Computadoras', '/img/laptop.png', 10),
        ('Audífonos inalámbricos',
         'Audífonos Bluetooth con cancelación de ruido',
         45.00, 'Accesorios', '/img/audifonos.png', 25),
        ('Smartwatch deportivo',
         'Reloj inteligente para seguimiento de actividad física',
         89.99, 'Tecnología', '/img/smartwatch.png', 15),
        ('Mouse inalámbrico',
         'Mouse ergonómico con conexión inalámbrica',
         19.99, 'Accesorios', '/img/mouse.png', 40),
        ('Teclado mecánico RGB',
         'Teclado mecánico con iluminación RGB',
         65.00, 'Accesorios', '/img/teclado.png', 20),
        ('iPhone',
         'Teléfono inteligente de ejemplo para el catálogo',
         699.00, 'Celulares', '/img/iphone.png', 8)
) AS demo(nombre, descripcion, precio, categoria, imagen_url, stock)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.productos AS actual
    WHERE LOWER(TRIM(actual.nombre)) = LOWER(TRIM(demo.nombre))
);

COMMIT;

-- Consulta final de verificacion:
SELECT id, nombre, precio, categoria, imagen_url, stock
FROM public.productos
ORDER BY id;
