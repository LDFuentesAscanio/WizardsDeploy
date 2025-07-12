'use client';
//External libraries
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="w-full bg-[#e7e7e7] text-[#2c3d5a] px-6 py-4 rounded-b-2xl shadow-md">
      <nav
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        {/* Logo sin fondo */}
        <div className="w-40 h-auto">
          <Image
            src="/icons/logonav.svg"
            alt="Wizards Logo"
            width={192}
            height={48}
            priority
          />
        </div>

        {/* Botón hamburguesa */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[#2c3d5a] focus:outline-none"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={open ? 'close' : 'menu'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Menú con fondo blanco */}
        <div
          className={`
            ${open ? 'flex' : 'hidden'} 
            md:flex bg-[#8effd2] rounded-xl px-6 py-3 shadow-md
          `}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm font-medium">
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Profile', href: '/profile/edit' },
              { label: 'Calendar', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'Search', href: '#' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block py-1 md:py-0 px-2 hover:text-[#67ff94] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
