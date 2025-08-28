'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { showError } from '@/utils/toastService';
import {
  fetchExploreOffers,
  type ExploreOfferCard,
} from '@/utils/exploreProjectsService';
import ExploreSearch from '@/components/organisms/projects/explore/ExploreSearch';
import ExploreOfferList from '@/components/organisms/projects/explore/ExploreOfferList';
import ExploreOfferDetailModal from '@/components/organisms/projects/explore/ExploreOfferDetailModal';
import Loader from '@/components/atoms/Loader';

export default function ExploreProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<ExploreOfferCard[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ExploreOfferCard | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchExploreOffers();
        setOffers(data);
      } catch (e) {
        console.error('❌ fetchExploreOffers error:', e);
        showError('Could not load project offers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return offers;
    const q = query.toLowerCase();
    return offers.filter((o) => {
      const haystack = [
        o.project_name ?? '',
        o.project_description ?? '',
        o.category_name ?? '',
        o.subcategory_name ?? '',
        o.description_solution ?? '',
        o.project_status ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [offers, query]);

  return (
    <main className="min-h-screen bg-[#2c3d5a] text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full px-6 py-8 max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white/80">Explore Projects</h1>
          <div />
        </div>

        <ExploreSearch value={query} onChange={setQuery} />

        {loading ? (
          <div className="mt-6 flex justify-center">
            <Loader />
          </div>
        ) : filtered.length ? (
          <ExploreOfferList offers={filtered} onSelect={setSelected} />
        ) : (
          <p className="mt-6 text-white/70">No offers match your search.</p>
        )}
      </motion.div>

      {selected && (
        <ExploreOfferDetailModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          offer={selected}
          onApply={async () => {
            // placeholder por ahora
            // showSuccess('Application sent'); // si luego quieres
          }}
        />
      )}
    </main>
  );
}
