import axios from 'axios';
import type { Vehiculo, Alquiler } from '../types';

// The proxy in vite.config.ts routes '/api' to the API Gateway 'http://localhost:8080'
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const vehicleService = {
  getAllVehicles: async (): Promise<Vehiculo[]> => {
    const response = await apiClient.get('/vehiculos');
    return response.data;
  },
  
  getVehicleById: async (id: number): Promise<Vehiculo> => {
    const response = await apiClient.get(`/vehiculos/${id}`);
    return response.data;
  },
  
  createVehicle: async (vehiculo: Partial<Vehiculo>): Promise<Vehiculo> => {
    const response = await apiClient.post('/vehiculos', vehiculo);
    return response.data;
  },
  
  updateVehicle: async (id: number, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> => {
    const response = await apiClient.put(`/vehiculos/${id}`, vehiculo);
    return response.data;
  },
  
  updateVehicleStatus: async (id: number, status: boolean): Promise<Vehiculo> => {
    const response = await apiClient.patch(`/vehiculos/${id}/estado`, null, {
      params: { estado: status }
    });
    return response.data;
  }
};

export const rentalService = {
  createRental: async (alquiler: Alquiler): Promise<any> => {
    const response = await apiClient.post('/operaciones/solicitudes', alquiler);
    return response.data;
  },
  
  getRentalsByVehicleId: async (vehiculoId: number): Promise<Alquiler[]> => {
    const response = await apiClient.get(`/operaciones/solicitudes/vehiculo/${vehiculoId}`);
    return response.data;
  },

  getAllRentals: async (): Promise<Alquiler[]> => {
    const response = await apiClient.get('/operaciones/solicitudes');
    return response.data;
  },

  approveRental: async (id: number): Promise<Alquiler> => {
    const response = await apiClient.put(`/operaciones/solicitudes/${id}/confirmar`);
    return response.data;
  },

  rejectRental: async (id: number): Promise<Alquiler> => {
    const response = await apiClient.put(`/operaciones/solicitudes/${id}/cancelar`);
    return response.data;
  }
};

export default apiClient;
