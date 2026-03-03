import HeroSection from '@/components/sections/HeroSection';
import ServicesStrip from '@/components/sections/ServicesStrip';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import AIToolsTeaser from '@/components/sections/AIToolsTeaser';
import StudioStatement from '@/components/sections/StudioStatement';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesStrip />
      <FeaturedProjects />
      <AIToolsTeaser />
      <StudioStatement />
    </>
  );
}
