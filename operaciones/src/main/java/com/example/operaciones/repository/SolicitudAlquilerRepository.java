package com.example.operaciones.repository;

import com.example.operaciones.model.SolicitudAlquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudAlquilerRepository extends JpaRepository<SolicitudAlquiler, Integer> {
    List<SolicitudAlquiler> findByVehiculoIdAndEstadoSolicitudIn(Integer vehiculoId, List<String> estados);
}
