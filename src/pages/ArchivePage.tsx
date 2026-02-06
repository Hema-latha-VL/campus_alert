import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { NoticeCard } from '@/components/NoticeCard';
import { NoticeDNAView } from '@/components/NoticeDNAView';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Notice, NoticeCategory, getCategoryColor } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { useAppState } from '@/state/AppState';

const filterChips = [
  { id: 'date', label: 'Date Range', icon: Calendar },
  { id: 'category', label: 'Category', icon: Filter },
];

const months = ['January 2025', 'December 2024', 'November 2024'];

const ArchivePage = () => {
  const { allNotices, getReminder } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | null>(null);

  const filteredNotices = allNotices.filter((notice) => {
    if (searchQuery && !notice.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && notice.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const categories: NoticeCategory[] = ['exam', 'placement', 'event', 'club', 'result', 'general'];

  return (
    <PageLayout mode="quiet" className="pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-display-md font-bold mb-2">Search & Archive</h1>
          <p className="text-muted-foreground">
            Find any notice from the past
          </p>
        </div>

        {/* Search Bar */}
        <GlassCard className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notices by title, category, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-transparent border-2 focus:border-primary rounded-xl transition-all duration-300 focus:shadow-glow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {filterChips.map((chip) => {
              const Icon = chip.icon;
              const isActive = activeFilters.includes(chip.id);
              
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleFilter(chip.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {chip.label}
                </button>
              );
            })}

            {/* Category filters */}
            {activeFilters.includes('category') && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-all capitalize',
                      selectedCategory === cat
                        ? getCategoryColor(cat)
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Search Results Count */}
        {searchQuery && (
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredNotices.length}</span> notices
          </p>
        )}

        {/* Archive Timeline */}
        <div className="space-y-8">
          {months.map((month, monthIndex) => (
            <div key={month} className="relative">
              {/* Month header */}
              <div className="sticky top-24 z-10 mb-4">
                <Badge
                  variant="secondary"
                  className="text-sm font-medium px-4 py-2 shadow-glass"
                >
                  {month}
                </Badge>
              </div>

              {/* Notices for this month */}
              <div className="relative pl-8 space-y-4">
                {/* Vertical timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

                {filteredNotices
                  .slice(monthIndex * 3, monthIndex * 3 + 3)
                  .map((notice, index) => (
                    <div
                      key={notice.id}
                      className={cn(
                        'relative animate-fade-in',
                        monthIndex > 0 && 'opacity-80'
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-5 top-6 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                      
                      <NoticeCard
                        notice={notice}
                        size="md"
                        showRelevance={false}
                        reminderActive={!!getReminder(notice.id)}
                        onClick={() => setSelectedNotice(notice)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notices found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
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

export default ArchivePage;
