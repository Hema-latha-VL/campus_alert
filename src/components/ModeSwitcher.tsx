import { NoticeMode } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Volume2, BookOpen, PartyPopper } from 'lucide-react';

interface ModeSwitcherProps {
  currentMode: NoticeMode;
  onModeChange: (mode: NoticeMode) => void;
  compact?: boolean;
}

const modes: { id: NoticeMode; label: string; icon: typeof Volume2 }[] = [
  { id: 'quiet', label: 'Quiet', icon: Volume2 },
  { id: 'exam', label: 'Exam', icon: BookOpen },
  { id: 'event', label: 'Event', icon: PartyPopper },
];

export const ModeSwitcher = ({ currentMode, onModeChange, compact = false }: ModeSwitcherProps) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/80 p-1 shadow-glass backdrop-blur-lg border border-white/30">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
              isActive
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            )}
          >
            <Icon className={cn('h-4 w-4', compact && 'h-3.5 w-3.5')} />
            {!compact && <span>{mode.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
