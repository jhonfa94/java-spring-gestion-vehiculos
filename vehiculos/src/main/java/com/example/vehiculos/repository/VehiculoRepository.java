package com.example.vehiculos.repository;

import com.example.vehiculos.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {
    List<Vehiculo> findByMarcaContainingIgnoreCase(String marca);
    List<Vehiculo> findByModeloContainingIgnoreCase(String modelo);
    List<Vehiculo> findByEstado(Boolean estado);
}
