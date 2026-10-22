# TechStore — Catálogo de productos

Proyecto de **Programación Web**: catálogo de productos con tarjetas responsivas, imágenes locales, **búsqueda instantánea** y operaciones **CRUD** desde un formulario. El frontend consulta un backend REST y los datos se guardan en PostgreSQL.

## Tecnologías

| Capa | Tecnología |
| --- | --- |
| Backend | Java (objetivo 21), Spring Boot 4.1.1 y Spring Web MVC |
| Datos | Spring Data JPA, Hibernate, PostgreSQL 16, JDBC Driver |
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 (CDN) |
| Comunicación | HTTP + JSON con `fetch()` |
| Desarrollo | IntelliJ IDEA, Maven Wrapper, Postman, Git y GitHub |

## Funcionalidades

- Listado de productos en tarjetas con nombre, categoría, descripción, precio, stock e imagen.
- Búsqueda **instantánea** por nombre, categoría o descripción, sin pulsar Enter.
- Formulario que se abre y se oculta con **Agregar producto**.
- Crear, editar y eliminar productos desde el navegador.
- Las tarjetas se actualizan consultando la API sin recargar manualmente la página.
- Diseño adaptable a móviles, tablets y escritorio.

## Arquitectura

El proyecto sigue una arquitectura **cliente-servidor**, con backend **monolítico organizado por capas**:

```text
Navegador (HTML + Bootstrap + JavaScript)
            | HTTP / JSON (fetch)
            v
ProductoController -> ProductoService -> ProductoRepository
                                             |
                                        JPA / Hibernate
                                             |
                                         PostgreSQL
```

El Controller ofrece la API REST, `Producto.java` representa la entidad y la vista es HTML/CSS/JavaScript servido por Spring Boot.

## Requisitos

- JDK **21 o posterior compatible** (proyecto configurado con objetivo Java 21; desarrollado con JDK 23).
- PostgreSQL 16, ejecutándose por defecto en `localhost:5432`.
- IntelliJ IDEA o PowerShell.
- Internet para descargar los estilos de Bootstrap desde el CDN. Las imágenes de productos son locales.

No hace falta instalar Maven globalmente: el repositorio incluye Maven Wrapper.

## Instalación y ejecución en otra computadora

### 1. Clonar el repositorio

```powershell
git clone https://github.com/Jordanjisv/catalogo-productos.git
cd catalogo-productos
```

Abre la carpeta en IntelliJ IDEA como proyecto Maven.

### 2. Crear la base de datos

En pgAdmin, abre el Query Tool conectado a la base `postgres` y ejecuta **una sola vez**:

```sql
CREATE DATABASE catalogo_productos;
```

Si ya existe la base, omite este paso.

### 3. Configurar PostgreSQL

El archivo `src/main/resources/application.properties` usa:

```properties
spring.application.name=catalogo-productos
spring.datasource.url=jdbc:postgresql://localhost:5432/catalogo_productos
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
server.port=8081
```

**No guardes tu contraseña real en GitHub.** En la terminal PowerShell donde iniciarás Spring Boot:

```powershell
$env:DB_PASSWORD = "TU_CONTRASEÑA_LOCAL"
```

Si utilizas el botón **Run** de IntelliJ, configura `DB_PASSWORD` en las variables de entorno de su configuración de ejecución.

### 4. Iniciar Spring Boot

```powershell
.\mvnw.cmd spring-boot:run
```

Cuando la aplicación arranque, abre **http://localhost:8081/**. Hibernate crea la tabla `productos` en la primera ejecución si no existe. `ddl-auto=update` es una opción para este proyecto de desarrollo, no una estrategia recomendada de migraciones en producción.

### 5. Cargar productos de ejemplo (opcional)

El archivo [`database/productos_ejemplo.sql`](database/productos_ejemplo.sql) carga **seis productos de muestra** con imágenes locales.

1. Inicia Spring Boot al menos una vez para crear la tabla `public.productos`.
2. En pgAdmin, abre el **Query Tool de la base `catalogo_productos`** (no el de `postgres`).
3. Abre `database/productos_ejemplo.sql` y ejecuta su contenido.
4. Refresca **http://localhost:8081/**.

El script no borra datos y **omite los productos cuyo nombre ya existe** (comparación sin mayúsculas). No exporta ni sustituye los productos reales de la base de datos que tengas en tu computadora. Si uno ya existe, conserva sus valores actuales, incluida la ruta de imagen.

## API REST

| Método | Endpoint | Función |
| --- | --- | --- |
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos/{id}` | Consultar uno |
| POST | `/api/productos` | Registrar producto |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Eliminar producto |

Ejemplo de **POST** a `http://localhost:8081/api/productos` con `Content-Type: application/json`:

```json
{
  "nombre": "Teclado compacto",
  "descripcion": "Teclado compacto para oficina",
  "precio": 39.99,
  "categoria": "Accesorios",
  "imagenUrl": "/img/teclado.png",
  "stock": 14
}
```

> El campo `imagenUrl` puede apuntar a cualquier imagen disponible en `src/main/resources/static/img/`.

Puedes probar el GET desde PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/productos" -Method GET
```

## Estructura del repositorio

```text
catalogo-productos/
├── database/
│   └── productos_ejemplo.sql
├── src/main/java/com/example/catalogo_productos/
│   ├── CatalogoProductosApplication.java
│   ├── controlador/ProductoController.java
│   ├── modelo/Producto.java
│   ├── repositorio/ProductoRepository.java
│   └── servicio/ProductoService.java
├── src/main/resources/
│   ├── application.properties
│   └── static/
│       ├── index.html
│       ├── css/styles.css
│       ├── js/products.js
│       ├── img/              # fotos utilizadas por el SQL
│       └── products/         # segunda copia existente de imágenes
├── pom.xml
├── mvnw.cmd
└── README.md
```

## Imágenes

Los archivos de `src/main/resources/static/img/` se publican directamente en `/img/`.

**Rutas presentes en el proyecto:**

- `/img/laptop.png`
- `/img/audifonos.png`
- `/img/smartwatch.png`
- `/img/mouse.png`
- `/img/teclado.png`
- `/img/iphone.png`

En el navegador: `http://localhost:8081/img/audifonos.png`. No incluyas `resources/static` en la URL; en esta práctica usamos `http`, no `https`.

## Búsqueda y diseño responsivo

- En `src/main/resources/static/js/products.js`, el evento `input` filtra los datos cargados con `filter()` e `includes()` y actualiza las tarjetas inmediatamente.
- Bootstrap adapta las columnas con `row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4`.
- El formulario se abre y cierra utilizando la clase `d-none` de Bootstrap.

## Seguridad y limitaciones

Este es un **proyecto académico local**. La API CRUD no tiene autenticación/autorización y no debe exponerse públicamente sin agregar protección y validación de los datos en el backend. La base PostgreSQL y sus registros no se incluyen en el repositorio: el SQL solo contiene datos ficticios de prueba.

## Documentación técnica

[Guía en Notion: tecnologías, arquitectura, funciones, MVC y diseño responsivo](https://app.notion.com/p/4015ffe0d8ad810ca6d1e8a6e3ba3b30?pvs=204).
