import React from 'react';

type LoadingProps = {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
