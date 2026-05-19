import React, { useState, useEffect, useMemo } from 'react';
import { rentalService } from '../services/api';
import { useVehicles } from '../hooks/useVehicles';
import type { Alquiler } from '../types';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { FaCalendarAlt } from 'react-icons/fa';

export const Requests: React.FC = () => {
  const [rentals, setRentals] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { vehiculos, loading: vLoading } = useVehicles();

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const thirtyDaysAhead = new Date(today);
  thirtyDaysAhead.setDate(today.getDate() + 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(thirtyDaysAhead.toISOString().split('T')[0]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getAllRentals();
      setRentals(data);
      setError(null);
    } catch (err: any) {
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setLoading(true);
      await rentalService.approveRental(id);
      await fetchRentals();
    } catch (err: any) {
      setError(err.response?.data || 'Error al aprobar la solicitud');
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setLoading(true);
      await rentalService.rejectRental(id);
      await fetchRentals();
    } catch (err: any) {
      setError(err.response?.data || 'Error al rechazar la solicitud');
      setLoading(false);
    }
  };

  const filteredRentals = useMemo(() => {
    if (!startDate || !endDate) return rentals;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return rentals.filter(r => {
      const rDate = new Date(r.fechaInicio);
      return rDate >= start && rDate <= end;
    });
  }, [rentals, startDate, endDate]);

  const getVehicleName = (id: number) => {
    const v = vehiculos.find(v => v.id === id);
    return v ? `${v.marca} ${v.modelo}` : `Vehículo #${id}`;
  };

  const getStatusBadge = (estado?: string) => {
    switch (estado) {
      case 'APROBADO': return <Badge text="Aprobado" type="success" />;
      case 'PENDIENTE': return <Badge text="Pendiente" type="warning" />;
      case 'RECHAZADO': return <Badge text="Rechazado" type="danger" />;
      default: return <Badge text={estado || 'Desconocido'} type="info" />;
    }
  };

  if (loading || vLoading) return <LoadingSpinner message="Cargando solicitudes..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitudes de Alquiler</h1>
          <p className="text-gray-600">Revisa y gestiona el historial de operaciones.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <FaCalendarAlt className="text-blue-500" />
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Desde</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Hasta</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600">ID</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Cliente</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Vehículo</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Fecha Inicio</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Fecha Fin</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Estado</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <p className="text-lg">No se encontraron solicitudes.</p>
                    <p className="text-sm mt-1">Intenta ajustando el rango de fechas.</p>
                  </td>
                </tr>
              ) : (
                filteredRentals.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-500 font-mono">#{r.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{r.clienteNombre}</td>
                    <td className="py-4 px-6 text-gray-700">{getVehicleName(r.vehiculoId)}</td>
                    <td className="py-4 px-6 text-gray-600">{r.fechaInicio}</td>
                    <td className="py-4 px-6 text-gray-600">{r.fechaFin}</td>
                    <td className="py-4 px-6">{getStatusBadge(r.estadoSolicitud)}</td>
                    <td className="py-4 px-6 text-center">
                      {r.estadoSolicitud === 'PENDIENTE' && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApprove(r.id!)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleReject(r.id!)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
