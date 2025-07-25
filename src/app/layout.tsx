import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Providers from './providers';

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
    <html lang="en" className={mulish.variable}>
      <body className="antialiased">
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
          toastOptions={{
            classNames: {
              toast: 'toast-slide-in rounded-lg shadow-xl',
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
