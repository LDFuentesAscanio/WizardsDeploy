'use client';
//External libraries
import { motion } from 'framer-motion';
//UI global components
import StatCard from '@/components/molecules/StatCard';

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsSectionProps {
  stats: StatItem[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-xs">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <StatCard label={stat.label} value={stat.value} />
        </motion.div>
      ))}
    </section>
  );
}
