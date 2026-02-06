import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppState } from '@/state/AppState';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/apiClient';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

export default function AdvisorFeedbackPage() {
  const { role, identity } = useAppState();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    // Only advisors and admins can view this page
    if (role !== 'advisor' && role !== 'admin') {
      navigate('/');
      return;
    }

    loadFeedback();
  }, [role, identity, navigate]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        feedbacks: Feedback[];
      }>(`/feedback/advisor/${identity}`);

      if (response.success) {
        setFeedbacks(response.feedbacks || []);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to load feedback',
        description: error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
        toast({
          title: 'Marked as read',
          description: 'Feedback has been marked as read.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Failed to update feedback',
        description: error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filter === 'unread') return f.status === 'unread';
    if (filter === 'read') return f.status === 'read';
    return true;
  });

  const unreadCount = feedbacks.filter((f) => f.status === 'unread').length;

  return (
    <PageLayout>
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              Student Feedback
            </h1>
            <p className="text-muted-foreground">
              Messages from your students. You have {unreadCount} unread feedback.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({feedbacks.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              size="sm"
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              onClick={() => setFilter('read')}
              size="sm"
            >
              Read ({feedbacks.length - unreadCount})
            </Button>
            <Button
              variant="outline"
              onClick={loadFeedback}
              size="sm"
              className="ml-auto"
            >
              Refresh
            </Button>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Loading feedback...
                </CardContent>
              </Card>
            ) : filteredFeedbacks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {filter === 'all'
                      ? 'No feedback yet. Your students will send feedback here.'
                      : `No ${filter} feedback.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <Card
                  key={feedback._id}
                  className={`transition-colors ${
                    feedback.status === 'unread'
                      ? 'border-primary/50 bg-primary/5'
                      : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">
                          {feedback.studentName}
                        </CardTitle>
                        <CardDescription>
                          {feedback.studentEmail}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {feedback.status === 'unread' && (
                          <Badge variant="default" className="gap-1">
                            <span className="h-2 w-2 bg-white rounded-full" />
                            New
                          </Badge>
                        )}
                        {feedback.status === 'read' && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Read
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    <p className="text-foreground whitespace-pre-wrap break-words mb-4">
                      {feedback.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(feedback.createdAt), 'MMM dd, yyyy h:mm a')}
                        </div>
                        <Badge variant="outline">{feedback.department}</Badge>
                      </div>
                      {feedback.status === 'unread' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(feedback._id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
