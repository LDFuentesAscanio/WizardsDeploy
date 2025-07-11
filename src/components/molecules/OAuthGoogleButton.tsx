'use client';

import Image from 'next/image';

interface OAuthGoogleButtonProps {
  onClick: () => void;
}

export default function OAuthGoogleButton({ onClick }: OAuthGoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white text-black py-3 rounded-xl mb-4 font-semibold flex items-center justify-center gap-3"
    >
      <Image src="/icons/google.svg" alt="Google Icon" width={20} height={20} />
      <span>Continue with Google</span>
    </button>
  );
}
