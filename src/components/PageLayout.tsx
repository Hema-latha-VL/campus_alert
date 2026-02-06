import { ReactNode } from 'react';

interface FloatingOrbProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'teal' | 'cyan' | 'coral' | 'purple';
  blur?: boolean;
}

export const FloatingOrb = ({
  className = '',
  size = 'md',
  color = 'teal',
  blur = true,
}: FloatingOrbProps) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  };

  const colorClasses = {
    teal: 'from-primary/30 to-primary/5',
    cyan: 'from-accent/30 to-accent/5',
    coral: 'from-destructive/30 to-destructive/5',
    purple: 'from-purple-400/30 to-purple-400/5',
  };

  return (
    <div
      className={`
        absolute rounded-full bg-gradient-radial ${sizeClasses[size]} ${colorClasses[color]}
        ${blur ? 'blur-3xl' : ''}
        animate-float pointer-events-none
        ${className}
      `}
    />
  );
};

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showOrbs?: boolean;
  mode?: 'quiet' | 'exam' | 'event';
}

export const PageLayout = ({
  children,
  className = '',
  showOrbs = true,
  mode = 'quiet',
}: PageLayoutProps) => {
  const modeClasses = {
    quiet: 'mode-quiet',
    exam: 'mode-exam',
    event: 'mode-event',
  };

  return (
    <div className={`min-h-screen ${modeClasses[mode]} relative overflow-auto transition-colors duration-700`}>
      {/* Background orbs */}
      {showOrbs && (
        <>
          <FloatingOrb 
            size="xl" 
            color="teal" 
            className="top-20 -right-48 float-slow" 
          />
          <FloatingOrb 
            size="lg" 
            color="cyan" 
            className="top-96 -left-32 float-delayed" 
          />
          <FloatingOrb 
            size="md" 
            color={mode === 'event' ? 'purple' : 'teal'} 
            className="bottom-20 right-20 float" 
          />
        </>
      )}
      
      {/* Content */}
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
};
