
package com.example.catalogo_productos.servicio;

import com.example.catalogo_productos.modelo.Producto;
import com.example.catalogo_productos.repositorio.ProductoRepository;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    // Consultar todos los productos
    public List<Producto> listar() {
        return repository.findAll();
    }

    // Buscar producto por ID
    public Producto buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"));
    }

    // Registrar un producto
    public Producto guardar(Producto producto) {
        producto.setId(null);
        return repository.save(producto);
    }

    // Actualizar un producto
    public Producto actualizar(Long id, Producto datos) {

        Producto producto = buscarPorId(id);

        producto.setNombre(datos.getNombre());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setCategoria(datos.getCategoria());
        producto.setImagenUrl(datos.getImagenUrl());
        producto.setStock(datos.getStock());

        return repository.save(producto);
    }

    // Eliminar un producto
    public void eliminar(Long id) {
        Producto producto = buscarPorId(id);
        repository.delete(producto);
    }
}
