'use client';

import Image from 'next/image';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white">
        <Image
          src="/icons/carga.svg"
          alt="Loading..."
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">
          Verifying your account...
        </h2>
        <p className="text-gray-600">Please, wait while we load the page...</p>
      </div>
    </div>
  );
}
