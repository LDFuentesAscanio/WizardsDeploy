'use client';

import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import type { ExploreOfferCard } from '@/utils/exploreProjectsService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  offer: ExploreOfferCard;
  onApply?: () => void | Promise<void>;
};

export default function ExploreOfferDetailModal({
  isOpen,
  onClose,
  offer,
  onApply,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60"
            aria-hidden="true"
          />
          {/* Wrapper con scroll */}
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2c3d5a] text-white rounded-xl w-full max-w-2xl h-[85vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-xl font-bold">Project Offer</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-3 py-1.5 hover:bg-white/10"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold">{offer.project_name}</h3>
                    {offer.project_description ? (
                      <p className="text-sm text-white/80 mt-1">
                        {offer.project_description}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {offer.category_name ? (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]">
                          {offer.category_name}
                        </span>
                      ) : null}
                      {offer.subcategory_name ? (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]">
                          {offer.subcategory_name}
                        </span>
                      ) : null}
                      {offer.project_status ? (
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]">
                          {offer.project_status}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {offer.description_solution ? (
                    <section>
                      <h4 className="text-sm font-semibold mb-2">
                        Offer details
                      </h4>
                      <p className="text-sm text-white/80">
                        {offer.description_solution}
                      </p>
                    </section>
                  ) : null}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex-shrink-0">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      className="flex-1"
                      onClick={async () => {
                        if (onApply) await onApply();
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
