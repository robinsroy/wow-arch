import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/providers/SmoothScrollProvider';
import PageTransitionProvider from '@/providers/PageTransitionProvider';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'WOW Studio — AI-Powered Architecture & Design',
  description:
    'AI-powered platform for architects and interior designers. Generate stunning visualizations, create presentations, and bring your design vision to life.',
  keywords: [
    'architecture',
    'interior design',
    'AI',
    'visualization',
    'rendering',
    'design studio',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <SmoothScrollProvider>
          <Header />
          <PageTransitionProvider>
            <main>{children}</main>
          </PageTransitionProvider>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
