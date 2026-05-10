package com.example.vehiculos.service;

import com.example.vehiculos.model.Vehiculo;
import com.example.vehiculos.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    @Autowired
    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<Vehiculo> obtenerTodos() {
        return vehiculoRepository.findAll();
    }

    public Optional<Vehiculo> obtenerPorId(Integer id) {
        return vehiculoRepository.findById(id);
    }

    public Vehiculo crearVehiculo(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    public Vehiculo actualizarVehiculo(Integer id, Vehiculo vehiculoDetalles) {
        return vehiculoRepository.findById(id).map(vehiculo -> {
            vehiculo.setPlaca(vehiculoDetalles.getPlaca());
            vehiculo.setMarca(vehiculoDetalles.getMarca());
            vehiculo.setModelo(vehiculoDetalles.getModelo());
            vehiculo.setColor(vehiculoDetalles.getColor());
            vehiculo.setEstado(vehiculoDetalles.getEstado());
            return vehiculoRepository.save(vehiculo);
        }).orElseThrow(() -> new RuntimeException("Vehiculo no encontrado con id " + id));
    }

    public void eliminarVehiculo(Integer id) {
        vehiculoRepository.deleteById(id);
    }

    public List<Vehiculo> buscarPorMarca(String marca) {
        return vehiculoRepository.findByMarcaContainingIgnoreCase(marca);
    }

    public List<Vehiculo> buscarPorModelo(String modelo) {
        return vehiculoRepository.findByModeloContainingIgnoreCase(modelo);
    }

    public List<Vehiculo> buscarPorEstado(Boolean estado) {
        return vehiculoRepository.findByEstado(estado);
    }
}
