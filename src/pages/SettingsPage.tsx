import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { departments, categories as noticeCategories, NoticeMode } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  BookOpen, 
  Briefcase, 
  Trophy,
  Users,
  Building,
  Volume2,
  PartyPopper,
  Check,
  Save
} from 'lucide-react';

const categoryIcons = {
  exam: BookOpen,
  placement: Briefcase,
  result: Trophy,
  event: PartyPopper,
  club: Users,
  general: Bell,
};

const modes = [
  { 
    id: 'quiet' as NoticeMode, 
    label: 'Quiet Mode', 
    icon: Volume2,
    description: 'Only critical alerts' 
  },
  { 
    id: 'exam' as NoticeMode, 
    label: 'Exam Mode', 
    icon: BookOpen,
    description: 'Academic notices prioritized' 
  },
  { 
    id: 'event' as NoticeMode, 
    label: 'Event Mode', 
    icon: PartyPopper,
    description: 'Clubs & activities surface' 
  },
];

const SettingsPage = () => {
  const [subscribedCategories, setSubscribedCategories] = useState<Set<string>>(
    new Set(['exam', 'placement', 'result'])
  );
  const [subscribedDepartments, setSubscribedDepartments] = useState<Set<string>>(
    new Set(['CSE'])
  );
  const [defaultMode, setDefaultMode] = useState<NoticeMode>('quiet');
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    urgent: true,
  });

  const toggleCategory = (id: string) => {
    const newSet = new Set(subscribedCategories);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSubscribedCategories(newSet);
  };

  const toggleDepartment = (id: string) => {
    const newSet = new Set(subscribedDepartments);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSubscribedDepartments(newSet);
  };

  return (
    <PageLayout mode="quiet" className="pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-md font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your AlertHub experience
            </p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-glow">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Category Subscriptions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Category Subscriptions
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose which types of notices you want to receive
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noticeCategories.map((cat) => {
              const Icon = categoryIcons[cat.id as keyof typeof categoryIcons] || Bell;
              const isSubscribed = subscribedCategories.has(cat.id);
              
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300',
                    isSubscribed
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isSubscribed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{cat.label}</p>
                  </div>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                      isSubscribed
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    )}
                  >
                    {isSubscribed && <Check className="h-4 w-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Department Subscriptions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Department Preferences
          </h2>
          <p className="text-muted-foreground mb-6">
            Select your department(s) for relevant notices
          </p>

          <div className="flex flex-wrap gap-3">
            {departments.map((dept) => {
              const isSubscribed = subscribedDepartments.has(dept);
              
              return (
                <button
                  key={dept}
                  onClick={() => toggleDepartment(dept)}
                  className={cn(
                    'px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
                    isSubscribed
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Mode Configuration */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Default Mode
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose your default viewing mode
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = defaultMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setDefaultMode(mode.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all duration-300',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Icon className={cn('h-6 w-6 mb-2', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <p className="font-medium">{mode.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Notification Preferences */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </h2>
          <p className="text-muted-foreground mb-6">
            How would you like to be notified?
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive instant alerts in browser</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
              <div>
                <p className="font-medium">Email Digest</p>
                <p className="text-sm text-muted-foreground">Daily summary of notices</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
              <div>
                <p className="font-medium">Urgent Only Mode</p>
                <p className="text-sm text-muted-foreground">Only notify for urgent notices</p>
              </div>
              <Switch
                checked={notifications.urgent}
                onCheckedChange={(checked) => setNotifications({ ...notifications, urgent: checked })}
              />
            </div>
          </div>
        </GlassCard>

        {/* Subscription Health */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Subscription Health</h2>
            <Badge variant="secondary" className="bg-teal-100 text-teal-700">
              92% Optimized
            </Badge>
          </div>
          
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: '92%' }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Your subscription settings are well-configured. You're receiving relevant notices while avoiding information overload.
          </p>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
