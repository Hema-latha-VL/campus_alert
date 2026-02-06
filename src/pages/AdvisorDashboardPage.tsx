import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiFetch, ApiError, eventApi, type EventData } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/state/AppState';
import { Users, Zap, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react';

interface Feedback {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentLoginName: string;
  department: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

interface StudentRecord {
  _id: string;
  firstName: string;
  lastName: string;
  loginName: string;
  department: string;
  advisorName: string;
  status: string;
}

const AdvisorDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { identity } = useAppState();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ students: StudentRecord[] }>('/auth/advisor/pending');
      setStudents(res.students);
    } catch (error) {
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({ title: 'Failed to load students', description: detail || 'Try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
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

  const loadFeedback = async () => {
    if (!identity) {
      console.log('Identity not available yet, skipping feedback load');
      setFeedbackLoading(false);
      return;
    }
    
    setFeedbackLoading(true);
    try {
      console.log('Loading feedback for advisor:', identity);
      
      // Fetch both assigned feedback and unassigned feedback
      const [assignedResponse, unassignedResponse] = await Promise.all([
        apiFetch<{
          success: boolean;
          feedbacks: Feedback[];
        }>(`/feedback/advisor/${identity}`),
        apiFetch<{
          success: boolean;
          feedbacks: Feedback[];
        }>(`/feedback/advisor/unassigned`)
      ]);

      console.log('Assigned feedback response:', assignedResponse);
      console.log('Unassigned feedback response:', unassignedResponse);
      
      const allFeedbacks = [
        ...(assignedResponse.success ? assignedResponse.feedbacks : []),
        ...(unassignedResponse.success ? unassignedResponse.feedbacks : [])
      ];
      
      setFeedbacks(allFeedbacks);
      console.log('Total feedbacks loaded:', allFeedbacks.length);
    } catch (error) {
      console.error('Error loading feedback:', error);
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({ title: 'Failed to load feedback', description: detail || 'Try again later.', variant: 'destructive' });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const markAsRead = async (feedbackId: string) => {
    try {
      const response = await apiFetch<{
        success: boolean;
        feedback: Feedback;
      }>(`/feedback/${feedbackId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.success) {
        setFeedbacks((prev) =>
          prev.map((f) => (f._id === feedbackId ? { ...f, status: 'read' } : f))
        );
        toast({ title: 'Marked as read' });
      }
    } catch (error) {
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({ title: 'Failed to update', description: detail || 'Try again later.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadStudents();
    loadEvents();
    loadFeedback();
  }, [identity]);

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
          <h1 className="text-4xl font-bold">Advisor Dashboard</h1>
          <Button onClick={() => navigate('/advisor/events')} className="gap-2">
            <Zap className="h-4 w-4" />
            Post Events
          </Button>
        </div>

        {/* Pending Students Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Pending Student Approvals</h2>
            {students.length > 0 && (
              <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
                {students.length} Pending
              </Badge>
            )}
          </div>

          {loading ? (
            <GlassCard className="p-12 text-center">
              <p className="text-muted-foreground">Loading pending students…</p>
            </GlassCard>
          ) : students.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-muted-foreground">No pending student requests.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {students.map((student) => (
                <GlassCard key={student._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{student.firstName} {student.lastName}</h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Login:</strong> {student.loginName}</p>
                        <p><strong>Department:</strong> {student.department}</p>
                      </div>
                    </div>
                    <Button
                      onClick={async () => {
                        try {
                          await apiFetch('/auth/advisor/approve', {
                            method: 'POST',
                            body: JSON.stringify({ studentId: student._id }),
                          });
                          toast({ title: 'Student approved', description: `${student.firstName} can now log in.` });
                          setStudents((prev) => prev.filter((s) => s._id !== student._id));
                        } catch (error) {
                          const detail = error instanceof ApiError ? error.detail : undefined;
                          toast({ title: 'Approval failed', description: detail || 'Try again later.', variant: 'destructive' });
                        }
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* Student Feedback Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Student Feedback</h2>
              {feedbacks.filter(f => f.status === 'unread').length > 0 && (
                <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
                  {feedbacks.filter(f => f.status === 'unread').length} New
                </Badge>
              )}
            </div>
            {feedbacks.length > 3 && (
              <Button variant="outline" size="sm" onClick={() => navigate('/advisor/feedback')}>
                View All
              </Button>
            )}
          </div>

          {feedbackLoading ? (
            <GlassCard className="p-12 text-center">
              <p className="text-muted-foreground">Loading feedback…</p>
            </GlassCard>
          ) : feedbacks.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No feedback received yet.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {feedbacks.slice(0, 3).map((feedback) => (
                <GlassCard key={feedback._id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{feedback.studentName}</h3>
                        {feedback.status === 'unread' && (
                          <Badge className="bg-primary/15 text-primary border-primary/25" variant="outline">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span><strong>Email:</strong> {feedback.studentEmail}</span>
                          <span><strong>Dept:</strong> {feedback.department}</span>
                        </div>
                        <p className="text-sm mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          {feedback.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Received: {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {feedback.status === 'unread' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(feedback._id)}
                        className="flex-shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
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

export default AdvisorDashboardPage;
