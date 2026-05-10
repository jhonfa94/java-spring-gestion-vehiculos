package com.example.operaciones.repository;

import com.example.operaciones.model.SolicitudAlquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudAlquilerRepository extends JpaRepository<SolicitudAlquiler, Integer> {
}
