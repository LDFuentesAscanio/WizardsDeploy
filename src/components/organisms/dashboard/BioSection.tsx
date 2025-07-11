'use client';

interface BioSectionProps {
  bio: string;
}

export default function BioSection({ bio }: BioSectionProps) {
  return (
    <section className="w-full max-w-4xl mt-6">
      <h2 className="text-xl font-semibold mb-2">About Me</h2>
      <p className="bg-[#e7e7e7] p-6 rounded-xl shadow text-[#2c3d5a]">
        {bio || 'No bio provided.'}
      </p>
    </section>
  );
}
