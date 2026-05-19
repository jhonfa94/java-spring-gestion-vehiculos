import React from 'react';
import { Link } from 'react-router-dom';
import { FaCarSide } from 'react-icons/fa';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-primary-dark font-bold text-xl hover:text-primary transition-colors">
              <FaCarSide className="text-2xl" />
              <span>AutoRent</span>
            </Link>
          </div>
          <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Inicio</Link>
          <Link to="/vehiculos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Vehículos</Link>
          <Link to="/solicitudes" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Solicitudes</Link>
          <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Admin</Link>
        </div>
        </div>
      </div>
    </nav>
  );
};
