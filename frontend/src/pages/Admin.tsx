import React, { useState } from 'react';
import { VehicleForm } from '../components/VehicleForm';
import { useVehicles } from '../hooks/useVehicles';
import { Badge } from '../components/Badge';
import { FaPlus, FaListUl } from 'react-icons/fa';
import type { Vehiculo } from '../types';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingVehicle, setEditingVehicle] = useState<Vehiculo | null>(null);
  const { vehiculos, loading, refetch } = useVehicles();

  const handleEditClick = (vehiculo: Vehiculo) => {
    setEditingVehicle(vehiculo);
    setActiveTab('form');
  };

  const handleCreateNewClick = () => {
    setEditingVehicle(null);
    setActiveTab('form');
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingVehicle(null);
    setActiveTab('list');
  };

  const handleFormCancel = () => {
    setEditingVehicle(null);
    setActiveTab('list');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona la flota de vehículos y sus estados operacionales.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            setEditingVehicle(null);
            setActiveTab('list');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
        >
          <FaListUl /> Inventario
        </button>
        <button
          onClick={handleCreateNewClick}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'form' && !editingVehicle ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
        >
          <FaPlus /> Registrar Vehículo
        </button>
      </div>

      {activeTab === 'form' ? (
        <div className="max-w-3xl">
          <VehicleForm 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel}
            initialData={editingVehicle}
            isEdit={!!editingVehicle}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 font-semibold text-gray-600">ID</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">Placa</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">Vehículo</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">Estado</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">Cargando inventario...</td>
                  </tr>
                ) : vehiculos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No hay vehículos registrados</td>
                  </tr>
                ) : (
                  vehiculos.map((v) => (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-500">#{v.id}</td>
                      <td className="py-4 px-6 font-medium">{v.placa}</td>
                      <td className="py-4 px-6">{v.marca} {v.modelo}</td>
                      <td className="py-4 px-6">
                        <Badge 
                          text={v.estado ? 'Disponible' : 'No Disponible'} 
                          type={v.estado ? 'success' : 'danger'} 
                        />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleEditClick(v)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
