'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Project {
  title: string;
  imageUrl: string;
  link: string;
}

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  return (
    <section className="w-full max-w-4xl mb-8">
      <h2 className="text-xl font-semibold mb-4 border-b border-[#e7e7e7] pb-1 text-white">
        Portfolio
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-sm">No projects registered.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="block border border-[#e7e7e7] rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white"
            >
              <div className="relative w-full h-40">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#2c3d5a]">
                  {project.title}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}
