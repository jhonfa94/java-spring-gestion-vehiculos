import React, { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleCard } from '../components/VehicleCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Vehicles: React.FC = () => {
  const { vehiculos, loading, error } = useVehicles();
  const [filter, setFilter] = useState<string | boolean>('ALL');

  if (loading) return <LoadingSpinner message="Cargando catálogo de vehículos..." />;
  if (error) return <ErrorMessage message={error} />;

  const filteredVehicles = vehiculos.filter(v => {
    if (filter === 'ALL') return true;
    return v.estado === filter;
  });

  return (
    <div>
      <div className="mb-8 md:flex md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestros Vehículos</h1>
          <p className="text-gray-600">Explora nuestra amplia gama de vehículos y encuentra el perfecto para ti.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === true ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Disponibles
          </button>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron vehículos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(vehiculo => (
            <VehicleCard key={vehiculo.id} vehiculo={vehiculo} />
          ))}
        </div>
      )}
    </div>
  );
};
