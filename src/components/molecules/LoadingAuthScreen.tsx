'use client';
//External libraries
import Image from 'next/image';
import { useEffect } from 'react';

interface LoadingAuthScreenProps {
  onAuthComplete: () => void;
}

export default function LoadingAuthScreen({ onAuthComplete }: LoadingAuthScreenProps) {
  // Simulamos un tiempo de carga mínimo para que la imagen se vea
  useEffect(() => {
    const timer = setTimeout(() => {
      onAuthComplete();
    }, 500); // Esperamos 500ms antes de completar la autenticación

    return () => clearTimeout(timer);
  }, [onAuthComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white">
        <Image
          src="/images/loading-spinner.svg"
          alt="Loading..."
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">Verificando tu cuenta...</h2>
        <p className="text-gray-600">Por favor, espera un momento...</p>
      </div>
    </div>
  );
}
