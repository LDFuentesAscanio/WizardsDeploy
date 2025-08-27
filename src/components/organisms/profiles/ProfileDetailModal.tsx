'use client';

import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { ExpertCardData } from '@/utils/profilesService';
import Button from '@/components/atoms/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profile: ExpertCardData;
  onMessage?: () => void | Promise<void>;
};

export default function ProfileDetailModal({
  isOpen,
  onClose,
  profile,
  onMessage,
}: Props) {
  const {
    avatarUrl,
    profession,
    bio,
    skills = [],
    tools = [],
    expertises = [],
  } = profile;

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

          {/* Wrapper que permite scroll general */}
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2c3d5a] text-white rounded-xl w-full max-w-2xl h-[85vh] overflow-hidden flex flex-col"
              >
                {/* Header fijo */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-xl font-bold">Profile</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-3 py-1.5 hover:bg-white/10"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Contenido scrollable */}
                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="Avatar"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">
                        {profession || 'Expert'}
                      </h3>
                      {bio ? (
                        <p className="text-sm text-white/80 mt-1">{bio}</p>
                      ) : null}
                    </div>
                  </div>

                  {!!expertises.length && (
                    <section>
                      <h4 className="text-sm font-semibold mb-2">Expertises</h4>
                      <div className="flex flex-wrap gap-2">
                        {expertises.map((it) => (
                          <span
                            key={it}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {!!skills.length && (
                    <section>
                      <h4 className="text-sm font-semibold mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((it) => (
                          <span
                            key={it}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {!!tools.length && (
                    <section>
                      <h4 className="text-sm font-semibold mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {tools.map((it) => (
                          <span
                            key={it}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 🔒 Nada de info personal (nombres completos, email, links, etc.) */}
                </div>

                {/* Footer fijo */}
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
                      onClick={async () => {
                        if (onMessage) await onMessage();
                      }}
                      className="flex-1"
                    >
                      Message
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
