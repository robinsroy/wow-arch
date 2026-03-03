export const NAV_LINKS = [
  { label: 'Practice', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'AI Studio', href: '/ai-tools' },
  { label: 'Configurator', href: '/configurator' },
  { label: 'Contact', href: '#contact' },
] as const;

export const SERVICES = [
  'Architecture',
  'Interior Design',
  'Landscape Design',
  'Master Planning',
] as const;

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'Pinterest', href: '#', icon: 'pin' },
] as const;

export const SITE_CONFIG = {
  name: 'WOW',
  tagline: 'Architecture · Interior Design · AI',
  description:
    'AI-powered platform for architects and interior designers. Generate stunning visualizations, create presentations, and bring your design vision to life.',
  copyright: `© ${new Date().getFullYear()} WOW Studio. All rights reserved.`,
} as const;
