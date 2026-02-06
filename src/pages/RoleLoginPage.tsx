import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppState, type UserRole } from '@/state/AppState';
import { ApiError } from '@/lib/apiClient';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  advisor: 'Advisor',
  student: 'Student',
};

const defaultRouteForRole = (role: UserRole) => {
  if (role === 'admin') return '/admin/advisors';
  if (role === 'advisor') return '/advisor';
  return '/';
};

const RoleLoginPage = () => {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { authReady, role: currentRole, setRole } = useAppState();

  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');

  const validRole = useMemo(() => (role === 'admin' || role === 'advisor' || role === 'student' ? role : null), [role]);

  useEffect(() => {
    if (!authReady) return;
    if (!currentRole) return;
    navigate(defaultRouteForRole(currentRole), { replace: true });
  }, [authReady, currentRole, navigate]);

  if (!validRole) {
    return (
      <PageLayout className="pt-28 pb-12 px-6" showOrbs>
        <div className="max-w-xl mx-auto">
          <GlassCard className="p-6">
            <h1 className="text-2xl font-bold">Invalid Role</h1>
            <p className="text-sm text-muted-foreground mt-2">Please select a role to continue.</p>
            <Button className="mt-4" onClick={() => navigate('/login')}>Back to Role Selection</Button>
          </GlassCard>
        </div>
      </PageLayout>
    );
  }

  const canSubmit = loginName.trim() && password.trim();

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Role Selection
          </Button>
        </div>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{roleLabels[validRole]} Login</h1>
              <p className="text-sm text-muted-foreground mt-2">Enter your portal credentials to continue.</p>
            </div>
            <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
              {roleLabels[validRole]}
            </Badge>
          </div>

          {validRole === 'admin' && (
            <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3">
              <p className="text-sm text-muted-foreground">Default admin credentials:</p>
              <p className="text-sm font-medium mt-1">Login: kec@kongu.edu</p>
              
            </div>
          )}

          {validRole === 'student' && (location.state as { pending?: boolean } | null)?.pending && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
              Your signup is pending advisor approval. Please try again after approval.
            </div>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium">Login Name</p>
            <Input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="e.g. kec@kongu.edu" />
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Password</p>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              disabled={!canSubmit}
              onClick={async () => {
                try {
                  await setRole(validRole, loginName.trim(), password);
                  toast({ title: 'Login successful', description: `Welcome back, ${roleLabels[validRole]}!` });
                  navigate(defaultRouteForRole(validRole), { replace: true });
                } catch (error) {
                  const detail = error instanceof ApiError ? error.detail : undefined;
                  if (detail === 'accept pending') {
                    toast({ title: 'Approval pending', description: 'Your advisor has not approved yet.', variant: 'destructive' });
                  } else {
                    toast({ title: 'Login failed', description: detail || 'Invalid credentials.', variant: 'destructive' });
                  }
                }
              }}
            >
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Back
            </Button>
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default RoleLoginPage;
