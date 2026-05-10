package com.example.operaciones.controller;

import com.example.operaciones.model.SolicitudAlquiler;
import com.example.operaciones.service.OperacionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operaciones/solicitudes")
public class OperacionesController {

    private final OperacionesService operacionesService;

    @Autowired
    public OperacionesController(OperacionesService operacionesService) {
        this.operacionesService = operacionesService;
    }

    @GetMapping
    public ResponseEntity<List<SolicitudAlquiler>> obtenerTodas() {
        return ResponseEntity.ok(operacionesService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudAlquiler> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(operacionesService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> registrarSolicitud(@RequestBody SolicitudAlquiler solicitud) {
        try {
            SolicitudAlquiler nuevaSolicitud = operacionesService.registrarSolicitud(solicitud);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSolicitud);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarAlquiler(@PathVariable Integer id) {
        try {
            SolicitudAlquiler solicitudConfirmada = operacionesService.confirmarAlquiler(id);
            return ResponseEntity.ok(solicitudConfirmada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarSolicitud(@PathVariable Integer id) {
        try {
            SolicitudAlquiler solicitudCancelada = operacionesService.cancelarSolicitud(id);
            return ResponseEntity.ok(solicitudCancelada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
