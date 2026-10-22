
package com.example.catalogo_productos.repositorio;

import com.example.catalogo_productos.modelo.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository
        extends JpaRepository<Producto, Long> {

}
