import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'teal' | 'cyan' | 'urgent' | 'none';
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  glow = 'none',
  onClick,
}: GlassCardProps) => {
  const glowClasses = {
    teal: 'hover:shadow-glow',
    cyan: 'hover:shadow-glow-cyan',
    urgent: 'shadow-glow-urgent',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card p-6',
        hover && 'hover-lift cursor-pointer',
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
};
