import Link from 'next/link';
import { NAV_LINKS, SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import { Linkedin, Instagram } from 'lucide-react';

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={18} />,
  instagram: <Instagram size={18} />,
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.85 6.39 9.28-.09-.78-.17-1.98.04-2.84.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.38.8-2.42 1.8-2.42.85 0 1.26.64 1.26 1.4 0 .85-.54 2.12-.82 3.3-.24 1 .5 1.81 1.47 1.81 1.77 0 3.12-1.87 3.12-4.56 0-2.38-1.71-4.05-4.15-4.05-2.83 0-4.49 2.12-4.49 4.31 0 .85.33 1.77.74 2.27.08.1.09.19.07.29-.08.31-.25 1-.28 1.14-.05.19-.15.23-.35.14-1.31-.61-2.12-2.53-2.12-4.07 0-3.31 2.41-6.36 6.95-6.36 3.65 0 6.48 2.6 6.48 6.07 0 3.62-2.28 6.54-5.46 6.54-1.07 0-2.07-.56-2.41-1.21l-.66 2.5c-.24.91-.88 2.05-1.31 2.75A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="bg-charcoal text-soft-white">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="label text-sand mb-6">Navigation</p>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-soft-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <p className="label text-sand mb-6">Services</p>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-muted">Architecture</span>
              <span className="text-sm text-muted">Interior Design</span>
              <span className="text-sm text-muted">Landscape Design</span>
              <span className="text-sm text-muted">AI Visualization</span>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="label text-sand mb-6">Get in Touch</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@wowstudio.ai"
                className="text-sm text-muted hover:text-soft-white transition-colors duration-300"
              >
                hello@wowstudio.ai
              </a>
              <span className="text-sm text-muted">Singapore</span>
            </div>
          </div>

          {/* Logo & Social */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between">
            <div className="flex items-center gap-1 mb-8">
              <span className="font-heading text-3xl font-bold tracking-[-0.02em] text-soft-white leading-none">
                W
              </span>
              <span className="font-heading text-3xl font-bold tracking-[-0.02em] text-gold leading-none">
                O
              </span>
              <span className="font-heading text-3xl font-bold tracking-[-0.02em] text-soft-white leading-none">
                W
              </span>
            </div>

            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-gold transition-colors duration-300"
                  aria-label={link.label}
                >
                  {socialIcons[link.icon]}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">{SITE_CONFIG.copyright}</p>
          <p className="text-xs text-muted">
            Crafted with precision & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
