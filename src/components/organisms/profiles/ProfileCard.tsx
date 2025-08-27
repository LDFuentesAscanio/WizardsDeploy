'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ExpertCardData } from '@/utils/profilesService';

type Props = {
  profile: ExpertCardData;
  onClick: () => void;
};

export default function ProfileCard({ profile, onClick }: Props) {
  const pills = [...(profile.skills ?? []), ...(profile.tools ?? [])].slice(
    0,
    6
  );

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="text-left bg-white/10 hover:bg-white/15 backdrop-blur rounded-xl p-4 shadow focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : null}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold">
            {profile.profession || 'Expert'}
          </h3>
          {profile.bio ? (
            <p className="text-xs text-white/70 line-clamp-2 mt-1">
              {profile.bio}
            </p>
          ) : null}
        </div>
      </div>

      {!!pills.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pills.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
}
