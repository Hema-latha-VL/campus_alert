import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiFetch, ApiError } from '@/lib/apiClient';

type AdvisorOption = {
  _id: string;
  firstName: string;
  lastName: string;
  loginName: string;
  department: string;
};

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    loginName: '',
    email: '',
    department: '',
    advisorName: '',
    advisorLoginName: '',
    phoneNumber: '',
    password: '',
  });
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([]);

  const updateField = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        const res = await apiFetch<{ advisors: AdvisorOption[] }>('/auth/advisors/public');
        setAdvisors(res.advisors);
      } catch (error) {
        const detail = error instanceof ApiError ? error.detail : undefined;
        toast({ title: 'Failed to load advisors', description: detail || 'Try again later.', variant: 'destructive' });
      }
    };

    loadAdvisors();
  }, [toast]);

  const canSubmit = Object.values(form).every((v) => v.trim());

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
            Back to Login
          </Button>
        </div>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Student Signup</h1>
              <p className="text-sm text-muted-foreground mt-2">Submit your details for advisor approval.</p>
            </div>
            <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
              Student
            </Badge>
          </div>

          <div className="mt-6 grid gap-4">
            <Input placeholder="First Name" value={form.firstName} onChange={(e) => updateField('firstName')(e.target.value)} />
            <Input placeholder="Last Name" value={form.lastName} onChange={(e) => updateField('lastName')(e.target.value)} />
            <Input placeholder="Login Name" value={form.loginName} onChange={(e) => updateField('loginName')(e.target.value)} />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email')(e.target.value)} />
            <Input placeholder="Department" value={form.department} onChange={(e) => updateField('department')(e.target.value)} />
            <div className="space-y-2">
              <p className="text-sm font-medium">Advisor</p>
              <Select
                value={form.advisorLoginName}
                onValueChange={(value) => {
                  const selected = advisors.find((advisor) => advisor.loginName === value);
                  updateField('advisorLoginName')(value);
                  updateField('advisorName')(selected ? `${selected.firstName} ${selected.lastName}` : '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={advisors.length ? 'Select advisor' : 'No advisors available'} />
                </SelectTrigger>
                <SelectContent>
                  {advisors.map((advisor) => (
                    <SelectItem key={advisor._id} value={advisor.loginName}>
                      {advisor.firstName} {advisor.lastName} • {advisor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => updateField('phoneNumber')(e.target.value)} />
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => updateField('password')(e.target.value)} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              disabled={!canSubmit}
              onClick={async () => {
                try {
                  await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(form) });
                  toast({ title: 'Signup submitted', description: 'Waiting for advisor approval.' });
                  navigate('/login/student', { state: { pending: true } });
                } catch (error) {
                  const detail = error instanceof ApiError ? error.detail : undefined;
                  toast({ title: 'Signup failed', description: detail || 'Please check your details.', variant: 'destructive' });
                }
              }}
            >
              Submit Signup
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

export default StudentSignupPage;
