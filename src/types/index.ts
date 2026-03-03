export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  year: number;
  description: string;
  coverImage: string;
  images: string[];
  area?: string;
  featured?: boolean;
}

export type ProjectCategory =
  | 'Architecture'
  | 'Interior Design'
  | 'Landscape Design'
  | 'Master Planning';

export interface AITool {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'available' | 'coming-soon';
  gradient: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
