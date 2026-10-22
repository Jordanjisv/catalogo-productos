
package com.example.catalogo_productos.controlador;

import com.example.catalogo_productos.modelo.Producto;
import com.example.catalogo_productos.servicio.ProductoService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    // Obtener todos los productos
    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    // Buscar producto por ID
    @GetMapping("/{id}")
    public Producto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // Registrar producto
    @PostMapping
    public ResponseEntity<Producto> crear(
            @RequestBody Producto producto) {

        Producto nuevo = service.guardar(producto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevo);
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public Producto actualizar(
            @PathVariable Long id,
            @RequestBody Producto producto) {

        return service.actualizar(id, producto);
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
