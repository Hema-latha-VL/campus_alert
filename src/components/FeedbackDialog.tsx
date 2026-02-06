import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiClient';
import { Mail, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeedbackDialogProps {
  studentId: string;
  disabled?: boolean;
  hasAdvisor?: boolean;
  advisorName?: string;
  isAuthReady?: boolean;
}

export const FeedbackDialog = ({ studentId, disabled = false, hasAdvisor = true, advisorName, isAuthReady = true }: FeedbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!studentId) {
      toast({
        title: 'Error',
        description: 'Unable to identify student. Please refresh the page and try again.',
        variant: 'destructive',
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: 'Empty feedback',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim(),
          studentId,
        }),
      });

      if (response.success) {
        toast({
          title: 'Feedback submitted',
          description: `Thank you! Your feedback has been sent to ${advisorName || 'your advisor'}.`,
        });
        setMessage('');
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast({
        title: 'Failed to submit feedback',
        description: error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const noAdvisorMessage = "You don't have an advisor assigned yet. Please contact your department or admin to get an advisor assigned before submitting feedback.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled} className="w-full gap-2">
          <Mail className="h-4 w-4" />
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback to Your Advisor</DialogTitle>
          <DialogDescription>
            Share your suggestions, concerns, or feedback with your academic advisor. They'll receive your message shortly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="min-h-[120px] resize-none"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !message.trim()}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
