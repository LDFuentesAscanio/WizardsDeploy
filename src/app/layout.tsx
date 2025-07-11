import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';
import './globals.css';

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Wizards',
  description: 'Login y autenticación con Supabase',
  icons: {
    icon: '/icons/Group.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={mulish.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
