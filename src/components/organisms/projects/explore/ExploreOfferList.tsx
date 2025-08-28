'use client';

import ExploreOfferCard from './ExploreOfferCard';
import type { ExploreOfferCard as Offer } from '@/utils/exploreProjectsService';

type Props = {
  offers: Offer[];
  onSelect: (o: Offer) => void;
};

export default function ExploreOfferList({ offers, onSelect }: Props) {
  if (!offers.length) return null;
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((o) => (
        <ExploreOfferCard key={o.id} offer={o} onClick={() => onSelect(o)} />
      ))}
    </div>
  );
}
