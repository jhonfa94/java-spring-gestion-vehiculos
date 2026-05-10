package com.example.operaciones.dto;

import lombok.Data;

@Data
public class VehiculoDto {
    private Integer id;
    private String placa;
    private String marca;
    private String modelo;
    private String color;
    private Boolean estado;
}
