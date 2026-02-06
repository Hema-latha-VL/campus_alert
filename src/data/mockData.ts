// Mock data for AlertHub

export type NoticeCategory = 'exam' | 'placement' | 'event' | 'club' | 'result' | 'general';
export type NoticePriority = 'urgent' | 'high' | 'medium' | 'low';
export type NoticeMode = 'quiet' | 'exam' | 'event';

export interface Notice {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: NoticeCategory;
  priority: NoticePriority;
  department?: string[];
  year?: number[];
  deadline?: Date;
  postedAt: Date;
  venue?: string;
  actionRequired?: string;
  actionLink?: string;
  upvotes: number;
  views: number;
  isVerified: boolean;
  relevanceReason?: string;
  viewedByPercentage?: number;
  imageUrl?: string;
  eventId?: string;
}

export interface UserStats {
  noticesViewed: number;
  upcomingDeadlines: number;
  subscriptionHealth: number;
  savedNotices: number;
}

// Helper to create dates relative to now
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const hoursFromNow = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

export const mockNotices: Notice[] = [
  {
    id: '2',
    title: 'Campus Placement Drive - Microsoft',
    summary: 'Microsoft hiring for SDE roles, register now',
    description: 'Microsoft is visiting our campus for Software Development Engineer positions. Eligible students must have 7.5+ CGPA with no active backlogs. Pre-placement talk on Monday at 10 AM.',
    category: 'placement',
    priority: 'high',
    department: ['CSE', 'ECE'],
    year: [4],
    deadline: daysFromNow(3),
    postedAt: daysFromNow(-1),
    venue: 'Seminar Hall A',
    actionRequired: 'Register Now',
    actionLink: '/placement-register',
    upvotes: 456,
    views: 2341,
    isVerified: true,
    relevanceReason: 'Deadline in 3 days',
    viewedByPercentage: 91,
  },
  {
    id: '3',
    title: 'Annual Tech Fest - TechnoVerse 2025',
    summary: 'Register for competitions and workshops',
    description: 'The biggest tech fest of the year is here! Participate in coding competitions, hackathons, robotics challenges, and more. Exciting prizes worth ₹5 lakhs to be won.',
    category: 'event',
    priority: 'medium',
    department: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'],
    year: [1, 2, 3, 4],
    deadline: daysFromNow(7),
    postedAt: daysFromNow(-3),
    venue: 'Main Auditorium',
    actionRequired: 'Register',
    actionLink: '/technoverse',
    upvotes: 189,
    views: 1456,
    isVerified: true,
    relevanceReason: '67% of classmates registered',
  },
  {
    id: '4',
    title: 'Mid-Semester Results Published',
    summary: 'Check your mid-semester examination results',
    description: 'Mid-semester examination results for all departments have been published on the student portal. Students with revaluation requests must apply within 7 days.',
    category: 'result',
    priority: 'high',
    department: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'],
    year: [1, 2, 3, 4],
    postedAt: hoursFromNow(-5),
    actionRequired: 'View Results',
    actionLink: '/results',
    upvotes: 312,
    views: 3421,
    isVerified: true,
    relevanceReason: 'Published today',
    viewedByPercentage: 78,
  },
  {
    id: '5',
    title: 'Photography Club - Weekend Workshop',
    summary: 'Learn portrait photography from professionals',
    description: 'Join us for an exclusive weekend workshop on portrait photography. Learn lighting, composition, and post-processing from award-winning photographers. Limited seats available.',
    category: 'club',
    priority: 'low',
    year: [1, 2, 3, 4],
    deadline: daysFromNow(5),
    postedAt: daysFromNow(-1),
    venue: 'Media Lab',
    actionRequired: 'Join Workshop',
    upvotes: 67,
    views: 423,
    isVerified: true,
    relevanceReason: 'Based on your interests',
  },
];

export const userStats: UserStats = {
  noticesViewed: 47,
  upcomingDeadlines: 5,
  subscriptionHealth: 92,
  savedNotices: 12,
};

export const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'CHEM'];

export const categories: { id: NoticeCategory; label: string; color: string }[] = [
  { id: 'exam', label: 'Exams', color: 'coral' },
  { id: 'placement', label: 'Placements', color: 'teal' },
  { id: 'result', label: 'Results', color: 'cyan' },
  { id: 'event', label: 'Events', color: 'purple' },
  { id: 'club', label: 'Clubs', color: 'pink' },
  { id: 'general', label: 'General', color: 'slate' },
];

export const getCategoryColor = (category: NoticeCategory): string => {
  const colors: Record<NoticeCategory, string> = {
    exam: 'bg-coral-100 text-coral-700 border-coral-200',
    placement: 'bg-teal-100 text-teal-700 border-teal-200',
    result: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    event: 'bg-purple-100 text-purple-700 border-purple-200',
    club: 'bg-pink-100 text-pink-700 border-pink-200',
    general: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return colors[category];
};

export const getPriorityGlow = (priority: NoticePriority): string => {
  const glows: Record<NoticePriority, string> = {
    urgent: 'border-2 border-destructive',
    high: 'glow-teal',
    medium: 'glow-cyan',
    low: '',
  };
  return glows[priority];
};

export const getTimeRemaining = (deadline: Date): string => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff < 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 24) return `${hours}h remaining`;
  if (days === 1) return '1 day left';
  return `${days} days left`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
