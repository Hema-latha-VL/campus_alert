import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';

export const SafeRedirect = ({
  to,
  title = 'Redirecting…',
  description = 'Taking you to the right place.',
}: {
  to: string;
  title?: string;
  description?: string;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-xl mx-auto">
        <GlassCard className="p-6">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </GlassCard>
      </div>
    </PageLayout>
  );
};
