package com.example.operaciones.client;

import com.example.operaciones.dto.VehiculoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class VehiculoClient {

    private final RestTemplate restTemplate;
    private final String VEHICULOS_API_URL = "http://vehiculos/api/vehiculos";

    @Autowired
    public VehiculoClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public VehiculoDto obtenerVehiculoPorId(Integer id) {
        return restTemplate.getForObject(VEHICULOS_API_URL + "/" + id, VehiculoDto.class);
    }

    public void actualizarEstadoVehiculo(Integer id, VehiculoDto vehiculoDto) {
        restTemplate.put(VEHICULOS_API_URL + "/" + id, vehiculoDto);
    }
}
