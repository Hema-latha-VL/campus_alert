import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppState, type UserRole } from '@/state/AppState';
import AccessRestrictedPage from '../pages/AccessRestrictedPage';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
}) => {
  const location = useLocation();
  const { authReady, role } = useAppState();

  if (!authReady) {
    return (
      <PageLayout className="pt-28 pb-12 px-6" showOrbs>
        <div className="max-w-xl mx-auto">
          <GlassCard className="p-6">
            <h1 className="text-xl font-semibold">Loading…</h1>
            <p className="text-sm text-muted-foreground mt-2">Checking your session and permissions.</p>
          </GlassCard>
        </div>
      </PageLayout>
    );
  }

  if (!role) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <AccessRestrictedPage />;
  }

  return <>{children}</>;
};
