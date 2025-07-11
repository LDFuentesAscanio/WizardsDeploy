'use client';

export default function VerifyView() {
  return (
    <div className="max-w-md w-full bg-white/10 backdrop-blur p-8 rounded-2xl text-center shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Check your email</h1>
      <p className="text-sm text-white/80 mb-6">
        We’ve sent a magic link to your inbox. <br /> Please check your email to
        continue.
      </p>
      <p className="text-xs text-white/50">
        Didn’t receive it? Check your spam folder or{' '}
        <a href="/auth" className="underline">
          try again
        </a>
      </p>
    </div>
  );
}
