import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="container-wide text-center">
        <h1 className="font-heading text-8xl md:text-9xl text-gold/20 mb-4">404</h1>
        <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
          Page Not Found
        </h2>
        <p className="text-graphite mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button href="/" variant="primary" size="lg" icon>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
