'use client';

import { motion } from 'framer-motion';

export default function ExploreProjectsPage() {
  return (
    <main className="min-h-screen bg-[#2c3d5a] text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full px-6 py-8 max-w-7xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-white/80 mb-4">
          Explore Projects
        </h1>
        <p className="text-white/70">
          Browse available projects to apply. (Coming soon)
        </p>
      </motion.div>
    </main>
  );
}
