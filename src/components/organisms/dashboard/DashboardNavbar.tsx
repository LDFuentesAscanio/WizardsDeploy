'use client';

// External libraries
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

type RoleName = 'customer' | 'admin' | 'expert' | null;

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleName>(null);

  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // 🔐 Obtener rol del usuario actual (sin contexto)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('users')
          .select('user_role:role_id (name)')
          .eq('id', user.id)
          .single();

        if (!error && data?.user_role?.name && isMounted) {
          setRole((data.user_role.name as string).toLowerCase() as RoleName);
        }
      } catch (e) {
        // Silencioso: si falla, mostramos menú base
        console.error('Navbar role fetch error:', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // 🧠 Ítems dinámicos por rol
  const navItems = useMemo<NavItem[]>(() => {
    const base: NavItem[] = [
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
    ];

    if (role === 'expert') {
      return [
        ...base,
        // Mis proyectos (solo los asignados) – misma ruta /projects, solo cambia el label
        {
          label: 'My Projects',
          href: '/projects',
          icon: <FolderCog size={16} />,
        },
        // Explorar proyectos disponibles para postularse – placeholder hasta implementar
        { label: 'Explore Projects', href: '#', icon: <Search size={16} /> },
      ];
    }

    // Customer/Admin
    return [
      ...base,
      // Gestionar proyectos (crear/editar/borrar) – misma ruta /projects
      {
        label: 'Manage Projects',
        href: '/projects',
        icon: <FolderCog size={16} />,
      },
      // Explorar perfiles – placeholder hasta implementar
      { label: 'Explore Profiles', href: '#', icon: <Search size={16} /> },
    ];
  }, [role]);

  return (
    <header className="w-full bg-[#e7e7e7] text-[#2c3d5a] px-6 py-4 rounded-b-2xl shadow-md z-50 relative">
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="w-40 h-auto block">
          <Image
            src="/icons/logonav.svg"
            alt="Wizards Logo"
            width={192}
            height={48}
            priority
          />
        </Link>

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
            {navItems.map(({ label, href, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 px-2 py-1 transition-transform duration-200 ${
                      isActive
                        ? 'text-[#2c3d5a] font-semibold'
                        : 'hover:scale-105'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              );
            })}
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
              {navItems.map(({ label, href, icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 px-2 py-1 transition-transform duration-200 ${
                        isActive
                          ? 'text-[#2c3d5a] font-bold'
                          : 'hover:scale-105'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {icon}
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    void handleLogout();
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
