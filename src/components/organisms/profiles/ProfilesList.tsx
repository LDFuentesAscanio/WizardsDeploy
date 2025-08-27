'use client';

import ProfileCard from './ProfileCard';
import type { ExpertCardData } from '@/utils/profilesService';

type Props = {
  profiles: ExpertCardData[];
  onSelect: (p: ExpertCardData) => void;
};

export default function ProfilesList({ profiles, onSelect }: Props) {
  if (!profiles.length) return null;

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((p) => (
        <ProfileCard key={p.id} profile={p} onClick={() => onSelect(p)} />
      ))}
    </div>
  );
}
