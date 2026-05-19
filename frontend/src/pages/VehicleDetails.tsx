import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicleService } from '../services/api';
import type { Vehiculo } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Badge } from '../components/Badge';
import { RentalForm } from '../components/RentalForm';
import { FaArrowLeft, FaCarSide, FaPalette, FaTag, FaCalendarAlt } from 'react-icons/fa';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await vehicleService.getVehicleById(Number(id));
        setVehiculo(data);
      } catch (err: any) {
        setError(err.message || 'No se pudo cargar la información del vehículo');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Cargando detalles..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!vehiculo) return <ErrorMessage message="Vehículo no encontrado" />;

  const imageUrl = vehiculo.urlImagen || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80`;

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <FaArrowLeft className="mr-2" /> Volver al catálogo
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-64 md:h-96 w-full relative">
          <img src={imageUrl} alt={vehiculo.modelo} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4">
            <Badge 
              text={vehiculo.estado ? 'Disponible' : 'No Disponible'} 
              type={vehiculo.estado ? 'success' : 'danger'} 
            />
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-gray-100">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{vehiculo.marca} {vehiculo.modelo}</h1>
              <p className="text-xl text-gray-500">Placa: {vehiculo.placa}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaTag className="text-blue-500"/> Especificaciones</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 flex items-center gap-2"><FaCarSide /> Marca</span>
                  <span className="font-semibold">{vehiculo.marca}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 flex items-center gap-2"><FaCarSide /> Modelo</span>
                  <span className="font-semibold">{vehiculo.modelo}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 flex items-center gap-2"><FaPalette /> Color</span>
                  <span className="font-semibold">{vehiculo.color}</span>
                </div>
                {vehiculo.fechaRegistro && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 flex items-center gap-2"><FaCalendarAlt /> Registrado</span>
                    <span className="font-semibold">{new Date(vehiculo.fechaRegistro).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              {vehiculo.estado === true ? (
                <RentalForm vehiculoId={vehiculo.id} />
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">Vehículo no disponible</h3>
                  <p className="text-yellow-700">Este vehículo se encuentra actualmente alquilado o en mantenimiento. No es posible realizar un alquiler en este momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
