import { useMemo } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import { useAppState } from '@/state/AppState';

const SuperAdminApprovalQueuePage = () => {
  const { toast } = useToast();
  const { approvalQueue, approveNotice, rejectNotice } = useAppState();

  const pendingCount = useMemo(() => approvalQueue.length, [approvalQueue.length]);

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold">Approval Queue</h1>
            <p className="text-muted-foreground">Approve or reject submitted notices (demo-only).</p>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
            Super Admin
          </Badge>
        </div>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-secondary/50">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Pending approvals</p>
                <p className="text-sm text-muted-foreground">{pendingCount} item(s) waiting</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {approvalQueue.map((item) => (
            <GlassCard key={item.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted by {item.department?.[0] ?? 'Admin Office'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-secondary/40">
                    pending
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => {
                      approveNotice(item.id);
                      toast({ title: 'Approved', description: 'Published instantly for students (demo).' });
                    }}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      rejectNotice(item.id);
                      toast({ title: 'Rejected', description: 'Removed from queue (demo).' });
                    }}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default SuperAdminApprovalQueuePage;
