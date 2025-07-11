'use client';

import Image from 'next/image';
import OAuthGoogleButton from '@/components/molecules/OAuthGoogleButton';
import EmailInputWithSubmit from '@/components/molecules/EmailInputWithSubmit';

interface LoginCardProps {
  mode: 'login' | 'signup';
  onGoogleLogin: () => void;
  onEmailSubmit: (email: string) => void;
  loading: boolean;
}

export default function LoginCard({
  mode,
  onGoogleLogin,
  onEmailSubmit,
  loading,
}: LoginCardProps) {
  return (
    <div className="bg-white/10 px-10 py-12 rounded-3xl text-center text-[#e7e7e7] shadow-lg max-w-xl w-full">
      <Image
        src="/icons/carga.svg"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto mb-6"
      />
      <h1 className="mb-6 text-3xl font-bold text-[#67ff94]">
        Welcome to Wizards.lat!
      </h1>

      <OAuthGoogleButton onClick={onGoogleLogin} />

      <p className="text-sm text-white/70 my-4">or continue with email</p>

      <EmailInputWithSubmit
        onSubmit={onEmailSubmit}
        loading={loading}
        mode={mode}
      />
    </div>
  );
}
