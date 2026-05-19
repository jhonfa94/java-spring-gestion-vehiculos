export interface Vehiculo {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  color: string;
  estado: boolean; // Ej: true (Disponible), false (No Disponible)
  urlImagen?: string;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}

export interface Alquiler {
  id?: number;
  vehiculoId: number;
  clienteNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estadoSolicitud?: string;
  fechaRegistro?: string;
}
