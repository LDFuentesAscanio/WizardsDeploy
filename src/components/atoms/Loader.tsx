// components/atoms/Loader.tsx
'use client';

import Image from 'next/image';

type Props = {
  src?: string;
  size?: number;
  className?: string;
};

export default function Loader({
  src = '/icons/carga.svg',
  size = 160,
  className = '',
}: Props) {
  return (
    <div className={`flex justify-center py-10 ${className}`}>
      <Image
        src={src}
        alt="Loading"
        width={size}
        height={size}
        className="animate-pulse w-auto h-auto"
        priority
      />
    </div>
  );
}
