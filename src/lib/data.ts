import type { Project, AITool } from '@/types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'azure-skyline-tower',
    title: 'Azure Skyline Tower',
    location: 'Singapore',
    category: 'Architecture',
    year: 2025,
    description:
      'A 48-storey mixed-use tower that reimagines vertical living with cascading sky gardens, creating a seamless dialogue between architecture and nature in the heart of the city.',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80',
    ],
    area: '85,000 sqm',
    featured: true,
  },
  {
    id: '2',
    slug: 'serene-haven-resort',
    title: 'Serene Haven Resort',
    location: 'Bali, Indonesia',
    category: 'Interior Design',
    year: 2024,
    description:
      'A luxury boutique resort that weaves indigenous Balinese materials with contemporary minimalism, creating sanctuaries of calm that honor the island\u2019s spiritual heritage.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
    area: '12,000 sqm',
    featured: true,
  },
  {
    id: '3',
    slug: 'botanical-commons',
    title: 'Botanical Commons',
    location: 'Melbourne, Australia',
    category: 'Landscape Design',
    year: 2025,
    description:
      'An urban park masterplan that transforms a 15-hectare former industrial site into a biodiverse community precinct with native plantings, wetlands, and public art.',
    coverImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    ],
    area: '150,000 sqm',
    featured: true,
  },
  {
    id: '4',
    slug: 'ivory-residences',
    title: 'Ivory Residences',
    location: 'Dubai, UAE',
    category: 'Architecture',
    year: 2024,
    description:
      'An exclusive residential compound of 24 villas that draws from desert geometry, with rammed-earth walls and perforated screens casting intricate light patterns throughout the day.',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    ],
    area: '45,000 sqm',
    featured: false,
  },
  {
    id: '5',
    slug: 'sakura-cultural-center',
    title: 'Sakura Cultural Center',
    location: 'Kyoto, Japan',
    category: 'Architecture',
    year: 2025,
    description:
      'A cultural center that bridges traditional Japanese timber construction with advanced parametric design, housing galleries, a tea pavilion, and community spaces beneath an undulating wooden canopy.',
    coverImage: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80',
    ],
    area: '8,500 sqm',
    featured: false,
  },
  {
    id: '6',
    slug: 'terrazza-hotel',
    title: 'Terrazza Hotel & Spa',
    location: 'Amalfi Coast, Italy',
    category: 'Interior Design',
    year: 2024,
    description:
      'A cliff-side boutique hotel renovation that celebrates Mediterranean craftsmanship — hand-laid terrazzo, local limestone, and bespoke ceramic installations against panoramic sea views.',
    coverImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
    ],
    area: '6,200 sqm',
    featured: false,
  },
];

export const MOCK_AI_TOOLS: AITool[] = [
  {
    id: 'image-gen',
    title: 'Image Generation',
    description:
      'Generate photorealistic architectural renders from sketches, floor plans, or text descriptions. Powered by advanced AI models.',
    icon: 'image',
    status: 'available',
    gradient: 'from-terracotta/20 to-gold/20',
  },
  {
    id: 'video-gen',
    title: 'Video Walkthrough',
    description:
      'Create cinematic video walkthroughs of your designs. Upload renders and let AI generate immersive flythrough animations.',
    icon: 'video',
    status: 'coming-soon',
    gradient: 'from-olive/20 to-terracotta/20',
  },
  {
    id: 'doc-gen',
    title: 'Design Documentation',
    description:
      'Auto-generate professional design documentation, mood boards, and presentation decks from your project data.',
    icon: 'file-text',
    status: 'coming-soon',
    gradient: 'from-gold/20 to-olive/20',
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer',
    description:
      'Apply architectural styles to your designs — transform a modern concept into Art Deco, Brutalist, Japanese Minimalism, and more.',
    icon: 'palette',
    status: 'coming-soon',
    gradient: 'from-terracotta/20 to-olive/20',
  },
];
