import { useState, useEffect, useCallback } from 'react';
import type { Vehiculo } from '../types';
import { vehicleService } from '../services/api';

export const useVehicles = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getAllVehicles();
      setVehiculos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener los vehículos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const getVehiculoById = (id: number) => {
    return vehiculos.find(v => v.id === id);
  };

  return {
    vehiculos,
    loading,
    error,
    refetch: fetchVehicles,
    getVehiculoById
  };
};
