import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Notice, NoticeCategory, NoticeMode, NoticePriority } from '@/data/mockData';
import { mockNotices } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { apiFetch } from '@/lib/apiClient';
import { DEMO_MODE } from '@/lib/demoMode';

export type GatewayView = 'home' | 'pulse' | 'dashboard' | 'timeline' | 'archive' | 'settings';

export type UserRole = 'student' | 'advisor' | 'admin';

export type UrgencyLevel = NoticePriority;

export interface UserPreferences {
  departments: string[];
  categories: NoticeCategory[];
  urgency: UrgencyLevel;
}

export interface AppPanels {
  preferencesOpen: boolean;
  notificationsOpen: boolean;
  profileOpen: boolean;
}

interface EngagementState {
  upvoteDeltaById: Record<string, number>;
  bookmarkedIds: string[];
  viewedIds: string[];
}

export type ReminderPreset = '1h' | '1d' | 'custom';

export interface NoticeReminder {
  noticeId: string;
  triggerAtIso: string;
  createdAtIso: string;
  preset: ReminderPreset;
  status: 'scheduled' | 'triggered';
}

interface AppState {
  authReady: boolean;
  role: UserRole | null;
  setRole: (role: UserRole, loginName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  identity: string;
  userId: string;
  advisorLoginName?: string;
  advisorName?: string;

  mode: NoticeMode;
  setMode: (mode: NoticeMode) => void;

  view: GatewayView;
  setView: (view: GatewayView) => void;

  preferences: UserPreferences;
  setPreferences: (next: UserPreferences) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;

  activeCategory: NoticeCategory | 'all';
  setActiveCategory: (category: NoticeCategory | 'all') => void;

  showRelevance: boolean;
  setShowRelevance: (next: boolean) => void;

  panels: AppPanels;
  setPanels: (next: AppPanels) => void;
  openPreferences: () => void;
  openNotifications: () => void;
  openProfile: () => void;
  closeAllPanels: () => void;

  engagement: EngagementState;
  upvoteNotice: (noticeId: string) => void;
  toggleBookmark: (noticeId: string) => void;
  markViewed: (noticeId: string) => void;
  isBookmarked: (noticeId: string) => boolean;

  remindersByNoticeId: Record<string, NoticeReminder>;
  setReminder: (noticeId: string, triggerAt: Date, preset: ReminderPreset) => void;
  clearReminder: (noticeId: string) => void;
  getReminder: (noticeId: string) => NoticeReminder | null;
  highlightedNoticeIds: string[];
  remindersEnabledCount: number;
  nextReminderAt: Date | null;

  approvalQueue: Notice[];
  submitNoticeForApproval: (draft: { title: string; summary: string; department?: string }) => void;
  approveNotice: (noticeId: string) => void;
  rejectNotice: (noticeId: string) => void;

  allNotices: Notice[];
  filteredNotices: Notice[];
  rankedNotices: Notice[];

  urgentTodayCount: number;
}

const AppStateContext = createContext<AppState | null>(null);

const STORAGE_KEYS = {
  preferences: 'alerthub.preferences',
  showRelevance: 'alerthub.showRelevance',
  mode: 'alerthub.mode',
  engagement: 'alerthub.engagement',
  reminders: 'alerthub.reminders',
  role: 'alerthub.role',
  identity: 'alerthub.identity',
  userId: 'alerthub.userId',
};

const buildDemoPublishedNotices = (): Notice[] => {
  return mockNotices
    .filter((n) => n.isVerified)
    .map((n) => ({
      ...n,
      relevanceReason: n.relevanceReason ?? 'Because it matches your preferences',
    }));
};

const buildDemoApprovalQueue = (): Notice[] => {
  return mockNotices
    .filter((n) => !n.isVerified)
    .map((n) => ({
      ...n,
      relevanceReason: n.relevanceReason ?? 'Pending verification',
    }));
};

const PRIORITY_RANK: Record<NoticePriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const isValidView = (value: string | null): value is GatewayView => {
  if (!value) return false;
  return ['home', 'pulse', 'dashboard', 'timeline', 'archive', 'settings'].includes(value);
};

const isValidMode = (value: string | null): value is NoticeMode => {
  if (!value) return false;
  return ['quiet', 'exam', 'event'].includes(value);
};

const isValidRole = (value: string | null): value is UserRole => {
  if (!value) return false;
  return ['student', 'advisor', 'admin'].includes(value);
};

const isValidCategory = (value: string | null): value is NoticeCategory => {
  if (!value) return false;
  return ['exam', 'placement', 'event', 'club', 'result', 'general'].includes(value);
};

const safeParseJson = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const safeGetItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

const safeRemoveItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
};

type MeResponse = { id: string; role: UserRole; loginName: string; status: string };

const scoreNotice = (notice: Notice, mode: NoticeMode): number => {
  const base =
    notice.priority === 'urgent'
      ? 100
      : notice.priority === 'high'
        ? 70
        : notice.priority === 'medium'
          ? 40
          : 10;

  const now = Date.now();
  const deadlineBoost = notice.deadline
    ? Math.max(0, 30 - (notice.deadline.getTime() - now) / (1000 * 60 * 60 * 24))
    : 0;

  const modeBoost =
    mode === 'exam'
      ? ['exam', 'result'].includes(notice.category)
        ? 25
        : -5
      : mode === 'event'
        ? ['event', 'club'].includes(notice.category)
          ? 25
          : -5
        : notice.priority === 'urgent'
          ? 10
          : 0;

  return base + deadlineBoost + modeBoost;
};

const computeFilteredNotices = (all: Notice[], preferences: UserPreferences, mode: NoticeMode, activeCategory: NoticeCategory | 'all') => {
  const minRank = PRIORITY_RANK[preferences.urgency];

  return all.filter((n) => {
    if (activeCategory !== 'all' && n.category !== activeCategory) return false;

    if (preferences.categories.length > 0 && !preferences.categories.includes(n.category)) return false;

    if (preferences.departments.length > 0 && n.department && !n.department.some((d) => preferences.departments.includes(d))) {
      return false;
    }

    if (PRIORITY_RANK[n.priority] < minRank) return false;

    if (mode === 'quiet') {
      if (n.priority === 'low' && !n.deadline) return false;
    }

    return true;
  });
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const storedPrefs = safeParseJson<UserPreferences>(safeGetItem(STORAGE_KEYS.preferences));
  const storedEngagement = safeParseJson<EngagementState>(safeGetItem(STORAGE_KEYS.engagement));
  const storedReminders = safeParseJson<Record<string, NoticeReminder>>(safeGetItem(STORAGE_KEYS.reminders));
  const storedMode = safeGetItem(STORAGE_KEYS.mode);
  const storedShowRelevance = safeGetItem(STORAGE_KEYS.showRelevance);

  const [authReady, setAuthReady] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [identity, setIdentityState] = useState<string>('');
  const [userId, setUserIdState] = useState<string>('');
  const [advisorLoginName, setAdvisorLoginNameState] = useState<string | undefined>();
  const [advisorName, setAdvisorNameState] = useState<string | undefined>();

  const [publishedNotices, setPublishedNotices] = useState<Notice[]>(() => (DEMO_MODE ? buildDemoPublishedNotices() : mockNotices));
  const [approvalQueue, setApprovalQueue] = useState<Notice[]>(() => (DEMO_MODE ? buildDemoApprovalQueue() : []));

  const approvalSeedRef = useRef<Notice[]>(buildDemoApprovalQueue());

  const [mode, setModeState] = useState<NoticeMode>(isValidMode(storedMode) ? storedMode : 'quiet');

  const [preferences, setPreferencesState] = useState<UserPreferences>(
    storedPrefs ?? { departments: ['CSE'], categories: ['exam', 'placement', 'event', 'club', 'result', 'general'], urgency: 'low' },
  );

  const [showRelevance, setShowRelevanceState] = useState<boolean>(storedShowRelevance ? storedShowRelevance === 'true' : true);

  const [engagement, setEngagement] = useState<EngagementState>(
    storedEngagement ?? { upvoteDeltaById: {}, bookmarkedIds: [], viewedIds: [] },
  );

  const [remindersByNoticeId, setRemindersByNoticeId] = useState<Record<string, NoticeReminder>>(storedReminders ?? {});
  const [highlightedNoticeIds, setHighlightedNoticeIds] = useState<string[]>([]);
  const remindersRef = useRef<Record<string, NoticeReminder>>(remindersByNoticeId);
  const highlightTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const lastUrlSyncRef = useRef<string>('');

  const demoAutoWidenedRef = useRef<boolean>(false);

  const [panels, setPanels] = useState<AppPanels>({
    preferencesOpen: false,
    notificationsOpen: false,
    profileOpen: false,
  });

  const [view, setViewState] = useState<GatewayView>(() => {
    const urlView = searchParams.get('view');
    return isValidView(urlView) ? urlView : 'home';
  });

  const [activeCategory, setActiveCategoryState] = useState<NoticeCategory | 'all'>(() => {
    const urlCat = searchParams.get('cat');
    return isValidCategory(urlCat) ? urlCat : 'all';
  });

  useEffect(() => {
    if (DEMO_MODE) {
      const storedRole = safeGetItem(STORAGE_KEYS.role);
      const storedIdentity = safeGetItem(STORAGE_KEYS.identity);

      const nextRole = isValidRole(storedRole) ? storedRole : null;
      const nextIdentity = storedIdentity ?? '';

      setRoleState(nextRole);
      setIdentityState(nextIdentity);
      document.documentElement.dataset.role = nextRole ?? 'guest';
      setAuthReady(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const me = await apiFetch<MeResponse>('/auth/me');
        if (cancelled) return;
        setRoleState(me.role);
        setIdentityState(me.loginName);
        setUserIdState(me.id);
        setAdvisorLoginNameState(me.advisorLoginName);
        setAdvisorNameState(me.advisorName);
        document.documentElement.dataset.role = me.role;
      } catch {
        if (cancelled) return;
        setRoleState(null);
        setIdentityState('');
        setUserIdState('');
        setAdvisorLoginNameState(undefined);
        setAdvisorNameState(undefined);
        document.documentElement.dataset.role = 'guest';
      } finally {
        if (cancelled) return;
        setAuthReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.mode, mode);
  }, [mode]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.showRelevance, String(showRelevance));
  }, [showRelevance]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.engagement, JSON.stringify(engagement));
  }, [engagement]);

  useEffect(() => {
    remindersRef.current = remindersByNoticeId;
    safeSetItem(STORAGE_KEYS.reminders, JSON.stringify(remindersByNoticeId));
  }, [remindersByNoticeId]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const urlView = searchParams.get('view');
    const nextView = isValidView(urlView) ? urlView : 'home';
    if (nextView !== view) setViewState(nextView);

    const urlCat = searchParams.get('cat');
    const nextCat = isValidCategory(urlCat) ? urlCat : 'all';
    if (nextCat !== activeCategory) setActiveCategoryState(nextCat);
  }, [activeCategory, location.pathname, searchParams, view]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const currentView = searchParams.get('view');
    const currentCat = searchParams.get('cat');

    const desiredView = view === 'home' ? null : view;
    const desiredCat = activeCategory === 'all' ? null : activeCategory;

    const signature = `${desiredView ?? ''}|${desiredCat ?? ''}`;
    if (lastUrlSyncRef.current === signature) return;

    if (currentView === desiredView && currentCat === desiredCat) {
      lastUrlSyncRef.current = signature;
      return;
    }

    const next = new URLSearchParams(searchParams);
    if (desiredView === null) next.delete('view');
    else next.set('view', desiredView);

    if (desiredCat === null) next.delete('cat');
    else next.set('cat', desiredCat);

    setSearchParams(next, { replace: true });
    lastUrlSyncRef.current = signature;
  }, [activeCategory, location.pathname, searchParams, setSearchParams, view]);

  const setMode = useCallback((next: NoticeMode) => {
    setModeState(next);
  }, []);

  const setRole = useCallback(async (next: UserRole, loginName: string, password: string) => {
    if (DEMO_MODE) {
      const trimmed = (loginName ?? '').trim();
      setRoleState(next);
      setIdentityState(trimmed);
      setUserIdState(trimmed); // In demo mode, use loginName as ID
      safeSetItem(STORAGE_KEYS.role, next);
      if (trimmed) safeSetItem(STORAGE_KEYS.identity, trimmed);
      else safeRemoveItem(STORAGE_KEYS.identity);
      document.documentElement.dataset.role = next;
      setAuthReady(true);
      return;
    }

    setAuthReady(false);
    try {
      const res = await apiFetch<{ id: string; role: UserRole; loginName: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role: next, loginName, password }),
      });

      setRoleState(res.role);
      setIdentityState(res.loginName);
      setUserIdState(res.id);
      document.documentElement.dataset.role = res.role;
      setAuthReady(true);
    } catch (error) {
      setAuthReady(true);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (DEMO_MODE) {
      setRoleState(null);
      setIdentityState('');
      setUserIdState('');
      setAdvisorLoginNameState(undefined);
      setAdvisorNameState(undefined);
      safeRemoveItem(STORAGE_KEYS.role);
      safeRemoveItem(STORAGE_KEYS.identity);
      safeRemoveItem(STORAGE_KEYS.userId);
      document.documentElement.dataset.role = 'guest';
      setAuthReady(true);
      return;
    }

    setAuthReady(false);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // best-effort; still clear client state
    } finally {
      setRoleState(null);
      setIdentityState('');
      setUserIdState('');
      setAdvisorLoginNameState(undefined);
      setAdvisorNameState(undefined);
      document.documentElement.dataset.role = 'guest';
      setAuthReady(true);
    }
  }, []);

  const setView = useCallback((next: GatewayView) => {
    setViewState(next);

    if (next !== 'settings') {
      setPanels((p) => ({ ...p, preferencesOpen: false }));
    }
  }, []);

  const setActiveCategory = useCallback((next: NoticeCategory | 'all') => {
    setActiveCategoryState(next);
  }, []);

  const setPreferences = useCallback((next: UserPreferences) => {
    setPreferencesState(next);
  }, []);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setPreferencesState((prev) => ({ ...prev, ...patch }));
    if (DEMO_MODE) {
      toast({ title: 'Preferences updated', description: 'Your feed updated instantly (demo).' });
    }
  }, []);

  const setShowRelevance = useCallback((next: boolean) => {
    setShowRelevanceState(next);
  }, []);

  const closeAllPanels = useCallback(() => {
    setPanels({ preferencesOpen: false, notificationsOpen: false, profileOpen: false });
  }, []);

  const openPreferences = useCallback(() => {
    setPanels({ preferencesOpen: true, notificationsOpen: false, profileOpen: false });
    setViewState('settings');
  }, []);

  const openNotifications = useCallback(() => {
    setPanels({ preferencesOpen: false, notificationsOpen: true, profileOpen: false });
  }, []);

  const openProfile = useCallback(() => {
    setPanels({ preferencesOpen: false, notificationsOpen: false, profileOpen: true });
  }, []);

  const setReminder = useCallback((noticeId: string, triggerAt: Date, preset: ReminderPreset) => {
    setRemindersByNoticeId((prev) => ({
      ...prev,
      [noticeId]: {
        noticeId,
        triggerAtIso: triggerAt.toISOString(),
        createdAtIso: new Date().toISOString(),
        preset,
        status: 'scheduled',
      },
    }));
  }, []);

  const clearReminder = useCallback((noticeId: string) => {
    setRemindersByNoticeId((prev) => {
      if (!prev[noticeId]) return prev;
      const next = { ...prev };
      delete next[noticeId];
      return next;
    });

    setHighlightedNoticeIds((prev) => prev.filter((id) => id !== noticeId));
    const timeout = highlightTimeoutsRef.current[noticeId];
    if (timeout) {
      clearTimeout(timeout);
      delete highlightTimeoutsRef.current[noticeId];
    }
  }, []);

  const getReminder = useCallback((noticeId: string) => remindersByNoticeId[noticeId] ?? null, [remindersByNoticeId]);

  const upvoteNotice = useCallback((noticeId: string) => {
    setEngagement((prev) => ({
      ...prev,
      upvoteDeltaById: {
        ...prev.upvoteDeltaById,
        [noticeId]: (prev.upvoteDeltaById[noticeId] ?? 0) + 1,
      },
    }));
  }, []);

  const toggleBookmark = useCallback((noticeId: string) => {
    setEngagement((prev) => {
      const exists = prev.bookmarkedIds.includes(noticeId);
      return {
        ...prev,
        bookmarkedIds: exists ? prev.bookmarkedIds.filter((id) => id !== noticeId) : [...prev.bookmarkedIds, noticeId],
      };
    });
  }, []);

  const markViewed = useCallback((noticeId: string) => {
    setEngagement((prev) => {
      if (prev.viewedIds.includes(noticeId)) return prev;
      return { ...prev, viewedIds: [...prev.viewedIds, noticeId] };
    });
  }, []);

  const isBookmarked = useCallback((noticeId: string) => engagement.bookmarkedIds.includes(noticeId), [engagement.bookmarkedIds]);

  useEffect(() => {
    if (DEMO_MODE) return;
    const interval = setInterval(() => {
      const snapshot = remindersRef.current;
      const now = Date.now();
      const due = Object.values(snapshot).filter((r) => r.status === 'scheduled' && new Date(r.triggerAtIso).getTime() <= now);
      if (due.length === 0) return;

      setRemindersByNoticeId((prev) => {
        const next = { ...prev };
        due.forEach((r) => {
          const current = next[r.noticeId];
          if (!current || current.status !== 'scheduled') return;
          next[r.noticeId] = { ...current, status: 'triggered' };
        });
        return next;
      });

      due.forEach((r) => {
        setHighlightedNoticeIds((prev) => (prev.includes(r.noticeId) ? prev : [...prev, r.noticeId]));

        const existing = highlightTimeoutsRef.current[r.noticeId];
        if (existing) clearTimeout(existing);
        highlightTimeoutsRef.current[r.noticeId] = setTimeout(() => {
          setHighlightedNoticeIds((prev) => prev.filter((id) => id !== r.noticeId));
          delete highlightTimeoutsRef.current[r.noticeId];
        }, 15000);

        toast({
          title: 'Reminder',
          description: 'A scheduled notice needs your attention now.',
          action: (
            <ToastAction altText="Cancel reminder" onClick={() => clearReminder(r.noticeId)}>
              Cancel
            </ToastAction>
          ),
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [clearReminder]);

  const allNotices = useMemo(() => {
    return publishedNotices.map((n) => {
      const upvoteDelta = engagement.upvoteDeltaById[n.id] ?? 0;
      const viewedBoost = engagement.viewedIds.includes(n.id) ? 1 : 0;
      return { ...n, upvotes: n.upvotes + upvoteDelta, views: n.views + viewedBoost };
    });
  }, [engagement.upvoteDeltaById, engagement.viewedIds, publishedNotices]);

  const submitNoticeForApproval = useCallback((draft: { title: string; summary: string; department?: string }) => {
    const now = new Date();
    const dept = (draft.department ?? '').trim();
    const notice: Notice = {
      id: `demo-user-${now.getTime()}`,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      description: draft.summary.trim(),
      category: 'general',
      priority: 'high',
      department: dept ? [dept] : ['Admin Office'],
      year: [1, 2, 3, 4],
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      postedAt: now,
      actionRequired: 'View',
      actionLink: '/',
      upvotes: 0,
      views: 0,
      isVerified: false,
      relevanceReason: 'Pending verification',
    };

    setApprovalQueue((prev) => [notice, ...prev]);
  }, []);

  const ensureQueueNotEmpty = useCallback((next: Notice[]) => {
    if (next.length > 0) return next;

    const seed = approvalSeedRef.current.length > 0 ? approvalSeedRef.current : buildDemoApprovalQueue();
    if (seed.length === 0) return next;

    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    return seed.slice(0, 3).map((n) => ({ ...n, id: `${n.id}-${suffix}` }));
  }, []);

  const approveNotice = useCallback((noticeId: string) => {
    setApprovalQueue((prev) => {
      const found = prev.find((n) => n.id === noticeId);
      if (!found) return prev;

      setPublishedNotices((pub) => [{ ...found, isVerified: true, relevanceReason: found.relevanceReason ?? 'Verified and published' }, ...pub]);
      const next = prev.filter((n) => n.id !== noticeId);
      return DEMO_MODE ? ensureQueueNotEmpty(next) : next;
    });
  }, [ensureQueueNotEmpty]);

  const rejectNotice = useCallback((noticeId: string) => {
    setApprovalQueue((prev) => {
      const next = prev.filter((n) => n.id !== noticeId);
      return DEMO_MODE ? ensureQueueNotEmpty(next) : next;
    });
  }, [ensureQueueNotEmpty]);

  const remindersEnabledCount = useMemo(() => {
    return Object.values(remindersByNoticeId).filter((r) => r.status === 'scheduled').length;
  }, [remindersByNoticeId]);

  const nextReminderAt = useMemo(() => {
    const scheduled = Object.values(remindersByNoticeId)
      .filter((r) => r.status === 'scheduled')
      .map((r) => new Date(r.triggerAtIso))
      .filter((d) => !Number.isNaN(d.getTime()));
    if (scheduled.length === 0) return null;
    return scheduled.sort((a, b) => a.getTime() - b.getTime())[0];
  }, [remindersByNoticeId]);

  const filteredNotices = useMemo(() => {
    return computeFilteredNotices(allNotices, preferences, mode, activeCategory);
  }, [allNotices, preferences, mode, activeCategory]);

  useEffect(() => {
    if (!DEMO_MODE) return;
    if (demoAutoWidenedRef.current) return;
    if (filteredNotices.length >= 6) return;

    demoAutoWidenedRef.current = true;
    setPreferencesState((prev) => ({
      ...prev,
      categories: ['exam', 'placement', 'event', 'club', 'result', 'general'],
      urgency: 'low',
    }));
    setActiveCategoryState('all');
  }, [filteredNotices.length]);

  const rankedNotices = useMemo(() => {
    return [...filteredNotices].sort((a, b) => scoreNotice(b, mode) - scoreNotice(a, mode));
  }, [filteredNotices, mode]);

  const urgentTodayCount = useMemo(() => {
    const now = Date.now();
    const oneDay = 1000 * 60 * 60 * 24;

    return rankedNotices.filter((n) => {
      const postedRecently = now - n.postedAt.getTime() <= oneDay;
      const urgentByPriority = n.priority === 'urgent';
      const urgentByDeadline = n.deadline ? n.deadline.getTime() - now <= 1000 * 60 * 60 * 24 : false;
      return postedRecently && (urgentByPriority || urgentByDeadline);
    }).length;
  }, [rankedNotices]);

  const value = useMemo<AppState>(
    () => ({
      authReady,
      role,
      setRole,
      logout,
      identity,
      userId,
      advisorLoginName,
      advisorName,
      mode,
      setMode,
      view,
      setView,
      preferences,
      setPreferences,
      updatePreferences,
      activeCategory,
      setActiveCategory,
      showRelevance,
      setShowRelevance,
      panels,
      setPanels,
      openPreferences,
      openNotifications,
      openProfile,
      closeAllPanels,
      engagement,
      upvoteNotice,
      toggleBookmark,
      markViewed,
      isBookmarked,
      remindersByNoticeId,
      setReminder,
      clearReminder,
      getReminder,
      highlightedNoticeIds,
      remindersEnabledCount,
      nextReminderAt,
      approvalQueue,
      submitNoticeForApproval,
      approveNotice,
      rejectNotice,
      allNotices,
      filteredNotices,
      rankedNotices,
      urgentTodayCount,
    }),
    [
      authReady,
      role,
      setRole,
      logout,
      identity,
      userId,
      advisorLoginName,
      advisorName,
      mode,
      setMode,
      view,
      setView,
      preferences,
      setPreferences,
      updatePreferences,
      activeCategory,
      setActiveCategory,
      showRelevance,
      setShowRelevance,
      panels,
      setPanels,
      openPreferences,
      openNotifications,
      openProfile,
      closeAllPanels,
      engagement,
      upvoteNotice,
      toggleBookmark,
      markViewed,
      isBookmarked,
      remindersByNoticeId,
      setReminder,
      clearReminder,
      getReminder,
      highlightedNoticeIds,
      remindersEnabledCount,
      nextReminderAt,
      approvalQueue,
      submitNoticeForApproval,
      approveNotice,
      rejectNotice,
      allNotices,
      filteredNotices,
      rankedNotices,
      urgentTodayCount,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
};
