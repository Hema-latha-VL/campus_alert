import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

const AdminDepartmentAnalyticsPage = () => {
  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold">Department Analytics</h1>
            <p className="text-muted-foreground">Demo insights for notice reach and engagement.</p>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
            Admin
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/15 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">4,521</p>
                <p className="text-sm text-muted-foreground">Active Students Reached</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/15 text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/50 text-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Notices This Week</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h3 className="font-semibold">Department Snapshot</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This is a frontend-only demo view. In a real system, analytics would be computed from backend events.
          </p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
              <p className="font-medium">Top Department</p>
              <p className="text-sm text-muted-foreground mt-1">CSE — strongest reach and fastest engagement.</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
              <p className="font-medium">Attention Gap</p>
              <p className="text-sm text-muted-foreground mt-1">Mechanical — lower reach during exam weeks.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AdminDepartmentAnalyticsPage;
