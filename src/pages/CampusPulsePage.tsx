import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { NoticeCard } from '@/components/NoticeCard';
import { NoticeDNAView } from '@/components/NoticeDNAView';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { Notice, NoticeCategory } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppState } from '@/state/AppState';
import { Search } from 'lucide-react';

const categories: NoticeCategory[] = ['exam', 'placement', 'event', 'club', 'result', 'general'];

const CampusPulsePage = () => {
  const { mode, setMode, rankedNotices, getReminder } = useAppState();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [activeCategory, setActiveCategory] = useState<NoticeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNotices = rankedNotices.filter((notice) => {
    if (activeCategory !== 'all' && notice.category !== activeCategory) return false;
    if (searchQuery.trim() && !notice.title.toLowerCase().includes(searchQuery.toLowerCase()) && !notice.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <PageLayout mode={mode} className="pt-28 pb-12 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-display-md font-bold mb-2">Campus Pulse</h1>
            <p className="text-muted-foreground">
              Real-time view of everything happening on campus
            </p>
          </div>
          <ModeSwitcher currentMode={mode} onModeChange={setMode} />
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid layout - show all posts */}
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">All Posts</h2>
            <Badge variant="secondary">{filteredNotices.length}</Badge>
          </div>

          {filteredNotices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice, index) => (
                <div
                  key={notice.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <NoticeCard
                    notice={notice}
                    size="md"
                    reminderActive={!!getReminder(notice.id)}
                    onClick={() => setSelectedNotice(notice)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-muted-foreground">
              <p>No notices found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notice DNA View Modal */}
      {selectedNotice && (
        <NoticeDNAView
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </PageLayout>
  );
};

export default CampusPulsePage;
