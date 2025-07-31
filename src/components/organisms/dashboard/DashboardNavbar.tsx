'use client';
// External libraries
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Settings,
  FolderCog,
  Search,
  LogOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/browserClient';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={16} />,
  },
  {
    label: 'Profile Settings',
    href: '/profile/edit',
    icon: <Settings size={16} />,
  },
  { label: 'Manage Projects', href: '#', icon: <FolderCog size={16} /> },
  { label: 'Explore Profiles', href: '#', icon: <Search size={16} /> },
];

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="w-full bg-[#e7e7e7] text-[#2c3d5a] px-6 py-4 rounded-b-2xl shadow-md z-50 relative">
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="w-40 h-auto">
          <Image
            src="/icons/logonav.svg"
            alt="Wizards Logo"
            width={192}
            height={48}
            priority
          />
        </div>

        {/* Mobile Menu Button */}
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

        {/* Desktop Menu */}
        <div className="hidden md:flex bg-[#8effd2] rounded-xl px-6 py-3 shadow-md">
          <ul className="flex gap-6 text-sm font-display font-medium items-center">
            {navItems.map(({ label, href, icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center gap-2 px-2 py-1 hover:text-[#67ff94] transition-colors duration-200"
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1 text-red-600 hover:text-red-400 transition-colors duration-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#8effd2] mt-4 rounded-xl px-6 py-3 shadow-md"
          >
            <ul className="flex flex-col gap-4 text-sm font-display font-medium">
              {navItems.map(({ label, href, icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-2 py-1 hover:text-[#67ff94] transition-colors duration-200"
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-2 py-1 text-red-600 hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
