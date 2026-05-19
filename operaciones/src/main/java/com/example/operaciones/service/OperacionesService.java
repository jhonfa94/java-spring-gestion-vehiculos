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

    public List<SolicitudAlquiler> obtenerActivasPorVehiculo(Integer vehiculoId) {
        return repository.findByVehiculoIdAndEstadoSolicitudIn(vehiculoId, List.of("PENDIENTE", "APROBADO"));
    }

    public SolicitudAlquiler obtenerPorId(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }

    public SolicitudAlquiler registrarSolicitud(SolicitudAlquiler solicitud) {
        VehiculoDto vehiculo = vehiculoClient.obtenerVehiculoPorId(solicitud.getVehiculoId());
        
        if (vehiculo == null) {
            throw new RuntimeException("El vehículo no existe");
        }
        
        List<SolicitudAlquiler> activas = obtenerActivasPorVehiculo(solicitud.getVehiculoId());
        for (SolicitudAlquiler activa : activas) {
            if (!(solicitud.getFechaFin().isBefore(activa.getFechaInicio()) || 
                  solicitud.getFechaInicio().isAfter(activa.getFechaFin()))) {
                throw new RuntimeException("El vehículo ya se encuentra ocupado en estas fechas.");
            }
        }

        solicitud.setEstadoSolicitud("PENDIENTE");
        return repository.save(solicitud);
    }

    public SolicitudAlquiler confirmarAlquiler(Integer id) {
        SolicitudAlquiler solicitud = obtenerPorId(id);
        
        if (!"PENDIENTE".equals(solicitud.getEstadoSolicitud())) {
            throw new RuntimeException("Solo se pueden aprobar solicitudes en estado PENDIENTE");
        }

        VehiculoDto vehiculo = vehiculoClient.obtenerVehiculoPorId(solicitud.getVehiculoId());
        if (vehiculo == null || !vehiculo.getEstado()) {
            throw new RuntimeException("El vehículo ya no está disponible");
        }

        vehiculo.setEstado(false);
        vehiculoClient.actualizarEstadoVehiculo(vehiculo.getId(), vehiculo);
        solicitud.setEstadoSolicitud("APROBADO");
        return repository.save(solicitud);
    }

    public SolicitudAlquiler cancelarSolicitud(Integer id) {
        SolicitudAlquiler solicitud = obtenerPorId(id);
        
        if ("RECHAZADO".equals(solicitud.getEstadoSolicitud())) {
            throw new RuntimeException("La solicitud ya está rechazada");
        }

        if ("APROBADO".equals(solicitud.getEstadoSolicitud())) {
            VehiculoDto vehiculo = vehiculoClient.obtenerVehiculoPorId(solicitud.getVehiculoId());
            if (vehiculo != null) {
                vehiculo.setEstado(true);
                vehiculoClient.actualizarEstadoVehiculo(vehiculo.getId(), vehiculo);
            }
        }

        solicitud.setEstadoSolicitud("RECHAZADO");
        return repository.save(solicitud);
    }
}
