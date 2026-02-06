import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Activity, ShieldCheck, Server, BellRing } from 'lucide-react';

const SuperAdminSystemOverviewPage = () => {
  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold">System Overview</h1>
            <p className="text-muted-foreground">High-level health and operations (demo-only).</p>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
            Super Admin
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/15 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/15 text-accent">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-muted-foreground">Alerts Today</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/50 text-foreground">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">Active Departments</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-background/80 text-foreground border border-red-400/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Critical Incidents</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h3 className="font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This screen is intentionally frontend-only. In production, these values would come from system telemetry.
          </p>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default SuperAdminSystemOverviewPage;
