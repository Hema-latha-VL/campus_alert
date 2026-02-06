import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Users, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Choose Your Role</h1>
          <p className="text-muted-foreground mt-2">Select your portal to continue</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/15 text-primary">
                <User className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Student</h3>
            <p className="text-sm text-muted-foreground mb-4">Access your student portal and notices</p>
            <Button className="w-full" onClick={() => navigate('/login/student')}>
              Student Login
            </Button>
            <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/signup/student')}>
              New Student Signup
            </Button>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/15 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Advisor</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage student approvals and events</p>
            <Button className="w-full" onClick={() => navigate('/login/advisor')}>
              Advisor Login
            </Button>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/15 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Admin</h3>
            <p className="text-sm text-muted-foreground mb-4">System administration and analytics</p>
            <Button className="w-full" onClick={() => navigate('/login/admin')}>
              Admin Login
            </Button>
            <Badge className="mt-3" variant="outline">Default: kec@kongu.edu</Badge>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
