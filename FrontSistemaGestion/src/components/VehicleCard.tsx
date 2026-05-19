import React from 'react';
import { Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { Badge } from './Badge';
import { FaCarSide, FaGasPump, FaCog } from 'react-icons/fa';

interface VehicleCardProps {
  vehiculo: Vehiculo;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehiculo }) => {
  const getStatusBadge = (estado: boolean) => {
    return <Badge 
      text={estado ? 'Disponible' : 'No Disponible'} 
      type={estado ? 'success' : 'danger'} 
    />;
  };

  // Fallback image if urlImagen is not provided by the backend
  const imageUrl = vehiculo.urlImagen || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover-lift">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`${vehiculo.marca} ${vehiculo.modelo}`} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          {getStatusBadge(vehiculo.estado)}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{vehiculo.marca} {vehiculo.modelo}</h3>
            <p className="text-sm text-gray-500">{vehiculo.placa}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaCarSide className="text-gray-400" />
            <span>{vehiculo.color}</span>
          </div>
          {/* Mocked features for aesthetics */}
          <div className="flex items-center gap-1">
            <FaCog className="text-gray-400" />
            <span>Auto</span>
          </div>
          <div className="flex items-center gap-1">
            <FaGasPump className="text-gray-400" />
            <span>Gasolina</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link to={`/vehiculos/${vehiculo.id}`} className="block">
            <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Ver Detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
