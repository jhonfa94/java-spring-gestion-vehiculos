import React, { useState, useEffect } from 'react';
import type { Vehiculo } from '../types';
import { vehicleService } from '../services/api';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';

interface VehicleFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: Vehiculo | null;
  isEdit?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess, onCancel, initialData, isEdit }) => {
  const [formData, setFormData] = useState<Partial<Vehiculo>>({
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    estado: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        placa: initialData.placa,
        marca: initialData.marca,
        modelo: initialData.modelo,
        color: initialData.color,
        estado: initialData.estado
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number | boolean = value;
    if (name === 'estado') finalValue = value === 'true';

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && initialData?.id) {
        await vehicleService.updateVehicle(initialData.id, formData);
      } else {
        await vehicleService.createVehicle(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || `Error al ${isEdit ? 'actualizar' : 'guardar'} el vehículo`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
        </h3>
        {isEdit && onCancel && (
          <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
            Cancelar Edición
          </button>
        )}
      </div>
      
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Placa</label>
          <input
            type="text"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            required
            disabled={isEdit} // Usualmente la placa no se cambia, pero si el backend lo permite se puede quitar
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${isEdit ? 'bg-gray-100 text-gray-500' : ''}`}
            placeholder="Ej: ABC-1234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Ej: Toyota"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Ej: Corolla"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Ej: Blanco"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            name="estado"
            value={formData.estado ? 'true' : 'false'}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="true">Disponible</option>
            <option value="false">No Disponible / Alquilado</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar Vehículo' : 'Guardar Vehículo')}
        </Button>
      </div>
    </form>
  );
};
