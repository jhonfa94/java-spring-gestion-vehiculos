import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-4 flex items-center gap-3">
      <FaExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
      <p className="text-red-700 font-medium">{message}</p>
    </div>
  );
};
