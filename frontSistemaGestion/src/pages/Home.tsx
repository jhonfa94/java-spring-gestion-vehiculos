import React from 'react';
import { Link } from 'react-router-dom';
import { FaCarSide, FaKey, FaHeadset } from 'react-icons/fa';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-blue-900 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 px-8 py-24 md:py-32 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Descubre el camino con <span className="text-blue-400">AutoRent</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
            La forma más rápida, segura y elegante de alquilar tu próximo vehículo. Conduce tus sueños hoy mismo con nuestra flota premium.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/vehiculos">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer">
                Ver Vehículos
              </button>
            </Link>
            <Link to="/admin">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer">
                Portal Admin
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Ofrecemos un servicio de calidad premium, con vehículos siempre en óptimas condiciones y asistencia en todo momento.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover-lift">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <FaCarSide />
            </div>
            <h3 className="text-xl font-bold mb-3">Flota Moderna</h3>
            <p className="text-gray-600">Vehículos de último modelo con el mejor mantenimiento garantizado.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover-lift">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <FaKey />
            </div>
            <h3 className="text-xl font-bold mb-3">Reserva Rápida</h3>
            <p className="text-gray-600">Proceso 100% digital. Reserva tu vehículo en menos de 5 minutos.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover-lift">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <FaHeadset />
            </div>
            <h3 className="text-xl font-bold mb-3">Soporte 24/7</h3>
            <p className="text-gray-600">Estamos contigo en cada kilómetro del viaje, a cualquier hora.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
