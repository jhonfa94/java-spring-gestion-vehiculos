package com.example.vehiculos.controller;

import com.example.vehiculos.model.Vehiculo;
import com.example.vehiculos.service.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculoController {

    private final VehiculoService vehiculoService;

    @Autowired
    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @GetMapping
    public List<Vehiculo> obtenerTodos() {
        return vehiculoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> obtenerPorId(@PathVariable Integer id) {
        return vehiculoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vehiculo> crearVehiculo(@RequestBody Vehiculo vehiculo) {
        Vehiculo nuevoVehiculo = vehiculoService.crearVehiculo(vehiculo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoVehiculo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehiculo> actualizarVehiculo(@PathVariable Integer id, @RequestBody Vehiculo vehiculo) {
        try {
            Vehiculo vehiculoActualizado = vehiculoService.actualizarVehiculo(id, vehiculo);
            return ResponseEntity.ok(vehiculoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVehiculo(@PathVariable Integer id) {
        vehiculoService.eliminarVehiculo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Vehiculo>> buscarVehiculos(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) Boolean estado) {
        
        if (marca != null) {
            return ResponseEntity.ok(vehiculoService.buscarPorMarca(marca));
        } else if (modelo != null) {
            return ResponseEntity.ok(vehiculoService.buscarPorModelo(modelo));
        } else if (estado != null) {
            return ResponseEntity.ok(vehiculoService.buscarPorEstado(estado));
        }
        
        return ResponseEntity.badRequest().build();
    }
}
