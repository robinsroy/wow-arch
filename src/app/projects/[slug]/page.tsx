import { notFound } from 'next/navigation';
import { MOCK_PROJECTS } from '@/lib/data';
import ProjectDetailClient from './ProjectDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = MOCK_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Find next project for "Next Project" CTA
  const currentIndex = MOCK_PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = MOCK_PROJECTS[(currentIndex + 1) % MOCK_PROJECTS.length];

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}
