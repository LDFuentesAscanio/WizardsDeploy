'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ProfilesSearch from '@/components/organisms/profiles/ProfilesSearch';

import { showError } from '@/utils/toastService';
import { ExpertCardData, fetchExperts } from '@/utils/profilesService';
import ProfilesList from '@/components/organisms/profiles/ProfilesList';
import ProfileDetailModal from '@/components/organisms/profiles/ProfileDetailModal';

export default function ExploreProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState<ExpertCardData[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ExpertCardData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchExperts();
        setExperts(data);
      } catch (e) {
        console.error('❌ fetchExperts error:', e);
        showError('Could not load profiles');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return experts;
    const q = query.toLowerCase();
    return experts.filter((e) => {
      const haystack = [
        e.profession ?? '',
        e.bio ?? '',
        ...(e.skills ?? []),
        ...(e.tools ?? []),
        ...(e.expertises ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [experts, query]);

  return (
    <main className="min-h-screen bg-[#2c3d5a] text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full px-6 py-8 max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white/80">Explore Profiles</h1>
          <div />
        </div>

        <ProfilesSearch value={query} onChange={setQuery} />

        {loading ? (
          <p className="mt-6 text-white/70">Loading profiles…</p>
        ) : filtered.length ? (
          <ProfilesList profiles={filtered} onSelect={setSelected} />
        ) : (
          <p className="mt-6 text-white/70">No profiles match your search.</p>
        )}
      </motion.div>

      {selected && (
        <ProfileDetailModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          profile={selected}
          onMessage={() => {
            // Aquí luego podrás navegar a /messages con el expert_id seleccionado
            // Por ahora mostramos un toast/placeholder:
            // showSuccess('Message sent');  // si quieres
          }}
        />
      )}
    </main>
  );
}
