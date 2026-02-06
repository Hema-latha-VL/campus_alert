import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert } from 'lucide-react';
import { useAppState } from '@/state/AppState';

const AccessRestrictedPage = () => {
  const navigate = useNavigate();
  const { role, logout } = useAppState();

  const roleLabel = useMemo(() => {
    if (role === 'admin') return 'Admin Mode';
    if (role === 'advisor') return 'Advisor Mode';
    if (role === 'student') return 'Student Mode';
    return 'Guest';
  }, [role]);

  const homeForRole = useMemo(() => {
    if (role === 'admin') return '/admin/advisors';
    if (role === 'advisor') return '/advisor';
    return '/';
  }, [role]);

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-xl mx-auto">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Access Restricted</h1>
              <p className="text-sm text-muted-foreground mt-2">
                This area isn’t available for your current role.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-background/80 text-foreground border border-red-400/40">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <Badge variant="outline" className="bg-secondary/40">
              {roleLabel}
            </Badge>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate(homeForRole)}
              className="w-full sm:w-auto"
            >
              Go to your dashboard
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="w-full sm:w-auto"
            >
              Switch role
            </Button>
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AccessRestrictedPage;
