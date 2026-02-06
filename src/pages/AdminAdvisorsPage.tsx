import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiFetch, ApiError, eventApi, type EventData } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { Users, Zap, ArrowLeft } from 'lucide-react';

interface AdvisorRecord {
  _id: string;
  firstName: string;
  lastName: string;
  loginName: string;
  department: string;
  phoneNumber: string;
}

const AdminAdvisorsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [advisors, setAdvisors] = useState<AdvisorRecord[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    loginName: '',
    email: '',
    department: '',
    phoneNumber: '',
    password: '',
  });

  const updateField = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadAdvisors = async () => {
    try {
      const res = await apiFetch<{ advisors: AdvisorRecord[] }>('/auth/advisors');
      setAdvisors(res.advisors);
    } catch (error) {
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({ title: 'Failed to load advisors', description: detail || 'Try again later.', variant: 'destructive' });
    }
  };

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await eventApi.getAll();
      setEvents(res.events);
    } catch (error) {
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({ title: 'Failed to load events', description: detail || 'Try again later.', variant: 'destructive' });
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisors();
    loadEvents();
  }, []);

  const canSubmit = Object.values(form).every((v) => v.trim());

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate('/admin/events')} className="gap-2">
            <Zap className="h-4 w-4" />
            Post Events
          </Button>
        </div>

        {/* Manage Advisors Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Manage Advisors</h2>
            {advisors.length > 0 && (
              <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
                Total {advisors.length}
              </Badge>
            )}
          </div>

          <GlassCard className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Add faculty advisors to enable access.</p>
              
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="First Name" value={form.firstName} onChange={(e) => updateField('firstName')(e.target.value)} />
                <Input placeholder="Last Name" value={form.lastName} onChange={(e) => updateField('lastName')(e.target.value)} />
                <Input placeholder="Login Name" value={form.loginName} onChange={(e) => updateField('loginName')(e.target.value)} />
                <Input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email')(e.target.value)} />
                <Input placeholder="Department" value={form.department} onChange={(e) => updateField('department')(e.target.value)} />
                <Input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => updateField('phoneNumber')(e.target.value)} />
                <Input type="password" placeholder="Temp Password" value={form.password} onChange={(e) => updateField('password')(e.target.value)} />
              </div>

              <Button
                disabled={!canSubmit}
                onClick={async () => {
                  try {
                    const res = await apiFetch('/auth/advisors', { method: 'POST', body: JSON.stringify(form) });
                    toast({ title: 'Advisor added', description: 'Advisor can now log in.' });
                    setForm({ firstName: '', lastName: '', loginName: '', email: '', department: '', phoneNumber: '', password: '' });
                    await loadAdvisors();
                    return res;
                  } catch (error) {
                    const detail = error instanceof ApiError ? error.detail : undefined;
                    toast({ title: 'Failed to add advisor', description: detail || 'Try again later.', variant: 'destructive' });
                  }
                }}
              >
                Add Advisor
              </Button>

              <div className="mt-6 grid gap-4">
                {advisors.map((advisor) => (
                  <GlassCard key={advisor._id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{advisor.firstName} {advisor.lastName}</h3>
                        <p className="text-sm text-muted-foreground">Login: {advisor.loginName}</p>
                        <p className="text-sm text-muted-foreground">Department: {advisor.department}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Posted Events Section */}
        {!eventsLoading && events.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Recent Events & Tests</h2>
            </div>
            
            <div className="grid gap-4">
              {events.slice(0, 5).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminAdvisorsPage;
