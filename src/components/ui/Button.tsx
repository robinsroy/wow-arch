'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  icon?: boolean;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  icon = false,
}: ButtonProps) {
  const variants = {
    primary:
      'bg-charcoal text-soft-white hover:bg-graphite',
    secondary:
      'bg-gold text-soft-white hover:bg-gold-light',
    outline:
      'bg-transparent border border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-soft-white',
    ghost:
      'bg-transparent text-charcoal hover:text-gold',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[11px]',
    md: 'px-7 py-3 text-[11px]',
    lg: 'px-10 py-4 text-xs',
  };

  const baseClasses = cn(
    'inline-flex items-center gap-2 font-medium tracking-[0.1em] uppercase rounded-full transition-all duration-300 cursor-pointer',
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {children}
      {icon && (
        <motion.span
          className="inline-block"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          <ArrowRight size={14} />
        </motion.span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
