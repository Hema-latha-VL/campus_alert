import { useMemo, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FilePlus2 } from 'lucide-react';
import { useAppState } from '@/state/AppState';

const AdminCreateNoticePage = () => {
  const { toast } = useToast();
  const { submitNoticeForApproval } = useAppState();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [department, setDepartment] = useState('');

  const canCreate = useMemo(() => title.trim().length > 3 && summary.trim().length > 10, [title, summary]);

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold">Create Notice</h1>
            <p className="text-muted-foreground">Draft a notice for review (demo-only, stored locally).</p>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
            Admin
          </Badge>
        </div>

        <GlassCard className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Title</p>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Internship registration deadline" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Summary</p>
            <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short actionable summary" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Department (optional)</p>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. CSE / Placement Cell" />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              disabled={!canCreate}
              onClick={() => {
                submitNoticeForApproval({ title, summary, department });
                toast({
                  title: 'Notice submitted for approval',
                  description: 'It was added to the Super Admin approval queue instantly (demo).',
                });
                setTitle('');
                setSummary('');
                setDepartment('');
              }}
              className="gap-2"
            >
              <FilePlus2 className="h-4 w-4" />
              Create Draft
            </Button>
            <Button variant="outline" onClick={() => { setTitle(''); setSummary(''); setDepartment(''); }}>
              Clear
            </Button>
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AdminCreateNoticePage;
