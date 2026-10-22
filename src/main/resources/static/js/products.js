
const API_URL = "/api/productos";

let todosLosProductos = [];

const contenedor = document.getElementById("contenedorProductos");
const buscador = document.getElementById("buscarProducto");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");
const inputImagenUrl = document.getElementById("imagenUrl");
const previewImagen = document.getElementById("previewImagen");

// Obtener productos desde Spring Boot
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        todosLosProductos = await respuesta.json();

        buscador.dispatchEvent(new Event("input"));

    } catch (error) {
        console.error(error);
        contenedor.replaceChildren();
        contador.textContent = "0 productos";
        mensaje.textContent =
            "Error al conectar con el servidor.";
        mensaje.classList.remove("d-none");
    }
}

// Mostrar productos en tarjetas Bootstrap
function mostrarProductos(productos) {

    contenedor.replaceChildren();

    contador.textContent =
        productos.length + " productos encontrados";

    if (productos.length === 0) {
        mensaje.textContent =
            "No se encontraron productos.";
        mensaje.classList.remove("d-none");
        return;
    }

    mensaje.classList.add("d-none");

    productos.forEach(producto => {

        const columna = document.createElement("div");
        columna.className = "col";

        // La estructura HTML es fija;
        // los valores externos se asignan con textContent.
        columna.innerHTML = `
            <article class="card tarjeta-producto h-100 shadow-sm">
                <img class="imagen-producto card-img-top"
                     alt="Imagen del producto">

                <div class="card-body d-flex flex-column">
                    <span class="categoria badge bg-primary-subtle text-primary align-self-start mb-2"></span>

                    <h3 class="nombre-producto"></h3>

                    <p class="descripcion-producto"></p>

                <div class="mt-auto">
                    <div class="precio-producto mb-2"></div>
                    <small class="stock-producto text-secondary"></small>
                    <div class="d-flex gap-2 mt-3">
                        <button type="button"
                                class="btn btn-outline-primary btn-sm flex-fill btn-editar">
                            Editar
                        </button>
                        <button type="button"
                                class="btn btn-outline-danger btn-sm flex-fill btn-eliminar">
                            Eliminar
                        </button>
                    </div>
                </div>

                </div>
            </article>
        `;

        const imagen = columna.querySelector(".imagen-producto");

        imagen.src = producto.imagenUrl ||
            "https://placehold.co/600x400?text=Producto";

        imagen.alt = producto.nombre || "Producto";

        imagen.onerror = () => {
            imagen.onerror = null;
            imagen.src =
                "https://placehold.co/600x400?text=Producto";
        };

        columna.querySelector(".categoria").textContent =
            producto.categoria ?? "";

        columna.querySelector(".nombre-producto").textContent =
            producto.nombre ?? "";

        columna.querySelector(".descripcion-producto").textContent =
            producto.descripcion ?? "";

        const precio = Number(producto.precio);

        columna.querySelector(".precio-producto").textContent =
            Number.isFinite(precio)
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                }).format(precio)
                : "Precio no disponible";

        columna.querySelector(".stock-producto").textContent =
            "Stock disponible: " + (producto.stock ?? 0);


        columna.querySelector(".btn-editar")
            .addEventListener("click", () => {
                editarProducto(producto);
            });

        columna.querySelector(".btn-eliminar")
            .addEventListener("click", () => {
                eliminarProducto(producto);
            });

        contenedor.appendChild(columna);
    });
}

// Normalizar texto para búsquedas
function normalizar(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Búsqueda instantánea
buscador.addEventListener("input", function () {

    const texto = normalizar(buscador.value.trim());

    const resultados = todosLosProductos.filter(producto => {

        const nombre = normalizar(producto.nombre);
        const categoria = normalizar(producto.categoria);
        const descripcion = normalizar(producto.descripcion);

        return nombre.includes(texto) ||
            categoria.includes(texto) ||
            descripcion.includes(texto);
    });

    mostrarProductos(resultados);
});

// Cargar productos al abrir la página
cargarProductos();

const formulario = document.getElementById("formProducto");
const mensajeFormulario =
    document.getElementById("mensajeFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");


const btnAgregarProducto =
    document.getElementById("btnAgregarProducto");

const panelFormulario =
    document.getElementById("panelFormulario");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const avisoCatalogo =
    document.getElementById("avisoCatalogo");

// Mostrar mensajes fuera del formulario
function mostrarAviso(texto) {
    avisoCatalogo.textContent = texto;
    avisoCatalogo.className = "alert alert-success mb-4";
}

// Abrir formulario para registrar productos
btnAgregarProducto.addEventListener("click", () => {

    const estaOculto =
        panelFormulario.classList.contains("d-none");

    if (estaOculto) {
        cancelarEdicion();

        panelFormulario.classList.remove("d-none");
        btnAgregarProducto.textContent = "Cerrar formulario";

        document.getElementById("nombre").focus();
    } else {
        cancelarEdicion();
    }
});

// Guarda el ID del producto que estamos editando
let productoEnEdicion = null;

// Cargar datos del producto al formulario
function editarProducto(producto) {

    productoEnEdicion = producto.id;

    document.getElementById("nombre").value =
        producto.nombre ?? "";

    document.getElementById("categoria").value =
        producto.categoria ?? "";

    document.getElementById("precio").value =
        producto.precio ?? "";

    document.getElementById("stock").value =
        producto.stock ?? "";

    document.getElementById("descripcion").value =
        producto.descripcion ?? "";

    document.getElementById("imagenUrl").value =
        producto.imagenUrl ?? "";
    actualizarVistaPreviaImagen();

    btnGuardar.textContent = "Actualizar producto";
    btnCancelar.classList.remove("d-none");

    panelFormulario.classList.remove("d-none");

    tituloFormulario.textContent = "Editar producto";

    btnAgregarProducto.textContent = "Cerrar formulario";


    mensajeFormulario.textContent =
        "Editando producto: " + producto.nombre;

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Regresar al modo registro

function cancelarEdicion() {

    productoEnEdicion = null;

    formulario.reset();

    btnGuardar.textContent = "Guardar producto";

    btnCancelar.classList.add("d-none");

    mensajeFormulario.textContent = "";

    // Ocultar el formulario
    panelFormulario.classList.add("d-none");

    // Restaurar el botón principal
    btnAgregarProducto.textContent = "+ Agregar producto";

    // Restaurar el título
    tituloFormulario.textContent =
        "Registrar nuevo producto";
    previewImagen.src = "https://placehold.co/300x200?text=Vista+previa";
}


btnCancelar.addEventListener("click", cancelarEdicion);

// Guardar o actualizar un producto
formulario.addEventListener("submit", async function(evento) {

    evento.preventDefault();

    const producto = {
        nombre: document.getElementById("nombre").value.trim(),
        categoria: document.getElementById("categoria").value.trim(),
        precio: Number(document.getElementById("precio").value),
        stock: Number(document.getElementById("stock").value),
        descripcion: document.getElementById("descripcion").value.trim(),
        imagenUrl: document.getElementById("imagenUrl").value.trim()
    };

    const editando = productoEnEdicion !== null;

    const url = editando
        ? `${API_URL}/${productoEnEdicion}`
        : API_URL;

    const metodo = editando ? "PUT" : "POST";

    btnGuardar.disabled = true;

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar el producto");
        }

        cancelarEdicion();

        // Mostrar todos los productos después de guardar
        buscador.value = "";

        await cargarProductos();


        mostrarAviso(
            editando
                ? "Producto actualizado correctamente."
                : "Producto registrado correctamente."
        );


    } catch (error) {
        mensajeFormulario.textContent = error.message;
        mensajeFormulario.className =
            "mt-3 mb-0 text-danger";
    } finally {
        btnGuardar.disabled = false;
    }
});


async function eliminarProducto(producto) {

    const confirmar = confirm(
        `¿Estás seguro de eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(
            `${API_URL}/${producto.id}`,
            {
                method: "DELETE"
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar el producto");
        }

        if (productoEnEdicion === producto.id) {
            cancelarEdicion();
        }

        await cargarProductos();
        mostrarAviso("Producto eliminado correctamente.");

    } catch (error) {
        mensajeFormulario.textContent = error.message;
        mensajeFormulario.className =
            "mt-3 mb-0 text-danger";
    }
}

function actualizarVistaPreviaImagen() {
    const ruta = inputImagenUrl.value.trim();

    previewImagen.src = ruta || "https://placehold.co/300x200?text=Vista+previa";
}

previewImagen.onerror = () => {
    previewImagen.onerror = null;
    previewImagen.src = "https://placehold.co/300x200?text=Sin+imagen";
};

inputImagenUrl.addEventListener("input", actualizarVistaPreviaImagen);