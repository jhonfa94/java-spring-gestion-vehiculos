package com.example.operaciones.service;

import com.example.operaciones.client.VehiculoClient;
import com.example.operaciones.dto.VehiculoDto;
import com.example.operaciones.model.SolicitudAlquiler;
import com.example.operaciones.repository.SolicitudAlquilerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperacionesService {

    private final SolicitudAlquilerRepository repository;
    private final VehiculoClient vehiculoClient;

    @Autowired
    public OperacionesService(SolicitudAlquilerRepository repository, VehiculoClient vehiculoClient) {
        this.repository = repository;
        this.vehiculoClient = vehiculoClient;
    }

    public List<SolicitudAlquiler> obtenerTodas() {
        return repository.findAll();
    }

    public SolicitudAlquiler obtenerPorId(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }

    public SolicitudAlquiler registrarSolicitud(SolicitudAlquiler solicitud) {
        VehiculoDto vehiculo = vehiculoClient.obtenerVehiculoPorId(solicitud.getVehiculoId());
        
        if (vehiculo == null) {
            throw new RuntimeException("El vehículo no existe");
        }
        if (!vehiculo.getEstado()) {
            throw new RuntimeException("El vehículo no está disponible para alquiler");
        }

        solicitud.setEstadoSolicitud("PENDIENTE");
        return repository.save(solicitud);
    }

    public SolicitudAlquiler confirmarAlquiler(Integer id) {
        SolicitudAlquiler solicitud = obtenerPorId(id);
        
        if (!"PENDIENTE".equals(solicitud.getEstadoSolicitud())) {
            throw new RuntimeException("Solo se pueden confirmar solicitudes en estado PENDIENTE");
        }

        VehiculoDto vehiculo = vehiculoClient.obtenerVehiculoPorId(solicitud.getVehiculoId());
        if (vehiculo == null || !vehiculo.getEstado()) {
            throw new RuntimeException("El vehículo ya no está disponible");
        }

        // Update vehicle status
        vehiculo.setEstado(false);
        vehiculoClient.actualizarEstadoVehiculo(vehiculo.getId(), vehiculo);

        // Update request status
        solicitud.setEstadoSolicitud("CONFIRMADA");
        return repository.save(solicitud);
    }

    public SolicitudAlquiler cancelarSolicitud(Integer id) {
        SolicitudAlquiler solicitud = obtenerPorId(id);
        
        if ("CANCELADA".equals(solicitud.getEstadoSolicitud())) {
            throw new RuntimeException("La solicitud ya está cancelada");
        }

        if ("CONFIRMADA".equals(solicitud.getEstadoSolicitud())) {
            VehiculoDto vehiculo = vehiculoClient.obtenerVehiculoPorId(solicitud.getVehiculoId());
            if (vehiculo != null) {
                vehiculo.setEstado(true);
                vehiculoClient.actualizarEstadoVehiculo(vehiculo.getId(), vehiculo);
            }
        }

        solicitud.setEstadoSolicitud("CANCELADA");
        return repository.save(solicitud);
    }
}
