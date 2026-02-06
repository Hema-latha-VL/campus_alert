import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Home, 
  Activity, 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Bell,
  User,
  Menu,
  CheckCircle2,
  FilePlus2,
  BarChart3,
  Users,
  Zap,
  Info,
  BookOpen,
  Clock
} from 'lucide-react';
import { ModeSwitcher } from './ModeSwitcher';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppState, type GatewayView, type UserRole } from '@/state/AppState';
import { NoticeCard } from '@/components/NoticeCard';
import { eventApi, type EventData } from '@/lib/apiClient';
import { type Notice } from '@/data/mockData';

type NavItem = {
  id: string;
  path: string;
  label: string;
  icon: typeof Home;
  roles: UserRole[];
  gatewayView?: GatewayView;
};

const navItems: NavItem[] = [
  { id: 'home', gatewayView: 'home', path: '/', label: 'Home', icon: Home, roles: ['student', 'advisor', 'admin'] },
  { id: 'pulse', gatewayView: 'pulse', path: '/pulse', label: 'Campus Pulse', icon: Activity, roles: ['student', 'advisor', 'admin'] },
  { id: 'mock-tests', path: '/mock-tests', label: 'Mock Tests', icon: BookOpen, roles: ['student'] },
  { id: 'about', path: '/about', label: 'About', icon: Info, roles: ['student', 'advisor', 'admin'] },

  { id: 'advisor_dashboard', path: '/advisor', label: 'Advisor Dashboard', icon: Users, roles: ['advisor'] },
  { id: 'advisor_events', path: '/advisor/events', label: 'Post Events', icon: Zap, roles: ['advisor'] },

  { id: 'admin_advisors', path: '/admin/advisors', label: 'Manage Advisors', icon: Users, roles: ['admin'] },
  { id: 'admin_create', path: '/admin/create', label: 'Create Notice', icon: FilePlus2, roles: ['admin'] },
  { id: 'admin_events', path: '/admin/events', label: 'Post Events', icon: Zap, roles: ['admin'] },
];

const resolveGatewayUrl = (view: GatewayView) => {
  if (view === 'home') return '/';
  return `/?view=${view}`;
};

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authReady, role, identity, logout, mode, setMode, view, setView, panels, openPreferences, openNotifications, openProfile, closeAllPanels, urgentTodayCount, allNotices, remindersByNoticeId } = useAppState();
  const [events, setEvents] = useState<EventData[]>([]);

  // Fetch events to include in reminder notifications
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventApi.getAll();
        setEvents(res.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Convert events to notices
  const eventToNotice = (event: EventData): Notice => ({
    id: event._id || `event-${event.name}-${Date.now()}`,
    title: event.name,
    summary: `${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}: ${event.description.substring(0, 50)}...`,
    description: event.description,
    category: event.eventType === 'placement' ? 'placement' : event.eventType === 'test' ? 'exam' : 'event',
    priority: 'high',
    department: [event.department || 'All'],
    deadline: new Date(event.date),
    postedAt: new Date(),
    upvotes: 0,
    views: 0,
    isVerified: true,
    imageUrl: event.imageUrl || undefined,
    relevanceReason: `${event.eventType} event${event.department ? ` for ${event.department}` : ' (Campus-wide)'}`,
  });

  // Merge events with all notices for reminder display
  const allNoticesWithEvents = [...events.map(eventToNotice), ...allNotices];

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');
  const roleReady = authReady && !!role;
  const allowedNavItems = roleReady ? navItems.filter((i) => i.roles.includes(role)) : [];

  const gatewayActiveView = location.pathname === '/' ? (searchParams.get('view') as GatewayView | null) ?? 'home' : null;

  const isActiveItem = (item: NavItem) => {
    if (item.gatewayView && location.pathname === '/') {
      return (gatewayActiveView ?? 'home') === item.gatewayView;
    }

    if (item.path === '/') return location.pathname === '/';
    return location.pathname === item.path;
  };

  const handleNav = (nextView: GatewayView) => {
    closeAllPanels();

    if (nextView === 'settings') {
      openPreferences();
      navigate(resolveGatewayUrl(nextView));
      return;
    }

    const target = resolveGatewayUrl(nextView);
    setView(nextView);
    navigate(target);
  };

  const handlePathNav = (item: NavItem) => {
    closeAllPanels();
    if (item.gatewayView) setView(item.gatewayView);
    navigate(item.path);
  };

  // Get all notices (including events) that have reminders
  const remindedNotices = allNoticesWithEvents.filter((notice) => remindersByNoticeId[notice.id]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-4 rounded-2xl border border-white/30">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate(roleReady ? '/' : '/login')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-glow-lg">
                <Bell className="h-4 w-4 text-primary-foreground" />
              </div>
              {urgentTodayCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">AlertHub</span>
          </button>

          {!isAuthRoute && authReady && (
            <div className="hidden md:block">
              <Badge variant="outline" className="bg-secondary/40">
                {role === 'admin' ? 'Admin Mode' : role === 'advisor' ? 'Advisor Mode' : role === 'student' ? 'Student Mode' : 'Guest'}
              </Badge>
            </div>
          )}

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {!isAuthRoute && allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveItem(item);
              
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => (item.gatewayView ? handleNav(item.gatewayView) : handlePathNav(item))}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ModeSwitcher currentMode={mode} onModeChange={setMode} compact />
            </div>

            <div className="md:hidden">
              <button
                type="button"
                onClick={() => openProfile()}
                className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            {!isAuthRoute && roleReady && (
              <button
                type="button"
                onClick={openNotifications}
                className="relative p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {urgentTodayCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />}
              </button>
            )}

            {!isAuthRoute && roleReady ? (
              <button
                type="button"
                onClick={openProfile}
                className={cn(
                  'w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-all duration-300',
                  view === 'settings' && 'shadow-glow'
                )}
                aria-label="Open profile"
              >
                <User className="h-5 w-5 text-primary" />
              </button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/login')} disabled={!authReady}>
                {authReady ? 'Login' : 'Loading…'}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden border-t border-border/50 px-4 py-2">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-1">
            {!isAuthRoute && allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveItem(item);
              
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => (item.gatewayView ? handleNav(item.gatewayView) : handlePathNav(item))}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 min-w-[60px]',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Sheet open={panels.notificationsOpen} onOpenChange={(open) => (open ? openNotifications() : closeAllPanels())}>
        <SheetContent className="glass-card border border-white/20 bg-white/80 backdrop-blur-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Reminders</SheetTitle>
            <SheetDescription>
              {remindedNotices.length > 0
                ? `You have ${remindedNotices.length} event${remindedNotices.length === 1 ? '' : 's'} with reminders set.`
                : 'No reminders set yet.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {remindedNotices.length > 0 ? (
              <div className="space-y-3">
                {remindedNotices.map((n) => (
                  <NoticeCard
                    key={n.id}
                    notice={n}
                    showRelevance={false}
                    onClick={() => handleNav('timeline')}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-muted-foreground space-y-4">
                <p>Click "Remind Me" on events in Journey Timeline to see them here</p>
                <Button variant="outline" onClick={() => handleNav('timeline')} className="w-full">
                  Go to Timeline
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={panels.profileOpen} onOpenChange={(open) => (open ? openProfile() : closeAllPanels())}>
        <SheetContent className="glass-card border border-white/20 bg-white/80 backdrop-blur-xl">
          <SheetHeader>
            <SheetTitle>Your Space</SheetTitle>
            <SheetDescription>
              Switch modes and jump to personalized views.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="md:hidden">
              <ModeSwitcher currentMode={mode} onModeChange={setMode} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveItem(item);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => (item.gatewayView ? handleNav(item.gatewayView) : handlePathNav(item))}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all duration-300',
                      isActive ? 'border-primary bg-primary/5 shadow-glow' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* History Button */}
            <button
              onClick={() => handlePathNav({ id: 'history', path: '/history', label: 'History', icon: Clock, roles: ['student', 'advisor', 'admin'] })}
              className={cn(
                'w-full p-3 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/50 transition-colors',
                location.pathname === '/history' && 'border-primary/60 bg-primary/10'
              )}
            >
              <div className="flex items-center gap-3 justify-center">
                <Clock className={cn('h-4 w-4', location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-medium text-sm">History</span>
              </div>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => handlePathNav({ id: 'settings', gatewayView: 'settings', path: '/settings', label: 'Settings', icon: Settings, roles: ['student', 'advisor', 'admin'] })}
              className={cn(
                'w-full p-3 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/50 transition-colors',
                location.pathname === '/settings' && 'border-primary/60 bg-primary/10'
              )}
            >
              <div className="flex items-center gap-3 justify-center">
                <Settings className={cn('h-4 w-4', location.pathname === '/settings' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-medium text-sm">Settings</span>
              </div>
            </button>

            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
              <p className="text-sm font-medium">Current role</p>
              <p className="text-sm text-muted-foreground mt-1">
                {role === 'admin' ? 'Admin Mode' : role === 'advisor' ? 'Advisor Mode' : role === 'student' ? 'Student Mode' : 'Guest'}
                {identity ? ` • ${identity}` : ''}
              </p>
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={async () => {
                  await logout();
                  closeAllPanels();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

