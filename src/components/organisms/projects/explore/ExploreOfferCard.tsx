'use client';

import { motion } from 'framer-motion';
import type { ExploreOfferCard } from '@/utils/exploreProjectsService';

type Props = {
  offer: ExploreOfferCard;
  onClick: () => void;
};

export default function ExploreOfferCard({ offer, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="text-left bg-white/10 hover:bg-white/15 backdrop-blur rounded-xl p-4 shadow focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold">{offer.project_name}</h3>
          {offer.project_description ? (
            <p className="text-xs text-white/70 line-clamp-2 mt-1">
              {offer.project_description}
            </p>
          ) : null}
        </div>
        {offer.project_status ? (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]">
            {offer.project_status}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {offer.category_name ? (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8effd2] text-[#1d2c45]">
            {offer.category_name}
          </span>
        ) : null}
        {offer.subcategory_name ? (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8effd2] text-[#1d2c45]">
            {offer.subcategory_name}
          </span>
        ) : null}
      </div>

      {offer.description_solution ? (
        <p className="text-xs text-white/70 mt-3 line-clamp-2">
          {offer.description_solution}
        </p>
      ) : null}
    </motion.button>
  );
}
