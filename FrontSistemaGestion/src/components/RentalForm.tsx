import React, { useState, useEffect } from 'react';
import { rentalService } from '../services/api';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import type { Alquiler } from '../types';

interface RentalFormProps {
  vehiculoId: number;
  onSuccess?: () => void;
}

export const RentalForm: React.FC<RentalFormProps> = ({ vehiculoId, onSuccess }) => {
  const [formData, setFormData] = useState({
    clienteNombre: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [existingRentals, setExistingRentals] = useState<Alquiler[]>([]);
  const [overlapMessage, setOverlapMessage] = useState<string | null>(null);

  useEffect(() => {
    rentalService.getRentalsByVehicleId(vehiculoId)
      .then(setExistingRentals)
      .catch(console.error);
  }, [vehiculoId]);

  const checkOverlap = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return null;
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    for (const r of existingRentals) {
      const rStart = new Date(r.fechaInicio);
      const rEnd = new Date(r.fechaFin);

      // Superposición: No (fin1 < inicio2) y No (inicio1 > fin2)
      if (!(endDate < rStart || startDate > rEnd)) {
        const nextAvailable = new Date(rEnd);
        nextAvailable.setDate(nextAvailable.getDate() + 1);
        const dateString = nextAvailable.toISOString().split('T')[0];
        return `Vehículo ocupado del ${r.fechaInicio} al ${r.fechaFin}. Disponible a partir del ${dateString}.`;
      }
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (newFormData.fechaInicio && newFormData.fechaFin) {
      const overlap = checkOverlap(newFormData.fechaInicio, newFormData.fechaFin);
      setOverlapMessage(overlap);
    } else {
      setOverlapMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overlapMessage) return; // No permitir enviar si hay overlap

    setLoading(true);
    setError(null);

    try {
      await rentalService.createRental({
        vehiculoId,
        clienteNombre: formData.clienteNombre,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data || err.message || 'Error al procesar la solicitud de alquiler');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold text-green-800 mb-2">¡Solicitud Exitosa!</h3>
        <p className="text-green-700">Tu solicitud de alquiler ha sido registrada y está pendiente de confirmación. Nos pondremos en contacto contigo pronto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Solicitar Alquiler</h3>
      
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            name="clienteNombre"
            value={formData.clienteNombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {overlapMessage && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">{overlapMessage}</p>
          </div>
        )}

        <div className="mt-6">
          <Button type="submit" variant="primary" fullWidth disabled={loading || !!overlapMessage}>
            {loading ? 'Procesando...' : 'Confirmar Solicitud'}
          </Button>
        </div>
      </div>
    </form>
  );
};
