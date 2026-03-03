'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(42,42,46,0.06)]'
            : 'bg-transparent'
        )}
      >
        <div className="container-wide flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-[-0.02em] text-charcoal leading-none">
                W
              </span>
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-[-0.02em] text-gold leading-none">
                O
              </span>
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-[-0.02em] text-charcoal leading-none">
                W
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300',
                  pathname === link.href
                    ? 'text-charcoal'
                    : 'text-graphite hover:text-charcoal'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold"
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-10 p-2 text-charcoal"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'font-heading text-4xl transition-colors duration-300',
                      pathname === link.href
                        ? 'text-gold'
                        : 'text-charcoal hover:text-gold'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-10 text-muted text-xs tracking-widest uppercase"
            >
              {SITE_CONFIG.tagline}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
