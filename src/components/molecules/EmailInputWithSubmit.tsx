'use client';

import { useState } from 'react';

interface EmailInputWithSubmitProps {
  onSubmit: (email: string) => void;
  loading: boolean;
  mode: 'login' | 'signup';
}

export default function EmailInputWithSubmit({
  onSubmit,
  loading,
  mode,
}: EmailInputWithSubmitProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValidEmail = emailRegex.test(email);

  const handleSubmit = () => {
    if (!isValidEmail) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <>
      <input
        type="email"
        placeholder="Enter your email"
        className={`w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white mb-2 ${
          error ? 'border-red-500' : ''
        }`}
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);
          if (value === '' || emailRegex.test(value)) {
            setError('');
          }
        }}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || !isValidEmail}
        className={`w-full py-3 rounded-xl font-semibold ${
          loading || !isValidEmail
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-400'
        }`}
      >
        {loading
          ? 'Sending...'
          : mode === 'signup'
          ? 'Sign up with email'
          : 'Sign in with email'}
      </button>
    </>
  );
}
