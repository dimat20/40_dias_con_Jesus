import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import { devotions, Devotion } from '../data/devotions';
import { ProgressState } from '../types';

interface CalendarViewProps {
  progress: ProgressState;
  onSelectDay: (dayNum: number) => void;
  activeDay: number;
}

export default function CalendarView({ progress, onSelectDay, activeDay }: CalendarViewProps) {
  const getDayStatus = (dayNum: number) => {
    const dayProgress = progress[dayNum];
    if (!dayProgress) return 'pending';
    
    if (dayProgress.completed) {
      return 'completed';
    }
    
    if (dayProgress.read || dayProgress.reflected || dayProgress.actionCompleted) {
      return 'in_progress';
    }
    
    return 'pending';
  };

  const getStatusStyle = (status: 'pending' | 'in_progress' | 'completed', isSelected: boolean) => {
    let base = "relative p-4 rounded-2xl border transition-all duration-300 text-left flex flex-col justify-between h-32 cursor-pointer ";
    
    if (isSelected) {
      base += "ring-2 ring-brand-medium shadow-lg shadow-purple-900/5 ";
    }

    switch (status) {
      case 'completed':
        return base + "bg-[#6b4fa3]/5 dark:bg-[#6b4fa3]/10 border-brand-medium/30 dark:border-brand-medium/40 text-brand-deep dark:text-purple-100 hover:bg-[#6b4fa3]/10 shadow-xl shadow-brand-medium/5";
      case 'in_progress':
        return base + "bg-[#fef9eb] dark:bg-gold-dark/5 border-[#f5e6b3] dark:border-gold-border/20 text-[#7a5c00] dark:text-gold hover:bg-[#fffdf5]/50";
      case 'pending':
      default:
        return base + "bg-white dark:bg-[#1a0e2e] border-purple-100/80 dark:border-purple-950/40 text-purple-400 hover:border-brand-medium dark:hover:border-purple-400 hover:bg-brand-bg dark:hover:bg-purple-950/20";
    }
  };

  return (
    <div id="calendar-view" className="space-y-6">
      <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-950/40 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-deep dark:text-purple-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-medium" />
            Calendario de 40 Días
          </h2>
          <p className="text-sm text-purple-400">
            Sigue tu avance diario y accede a cualquier devocional en cualquier momento.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {devotions.map((devotion: Devotion) => {
          const status = getDayStatus(devotion.day);
          const isSelected = activeDay === devotion.day;
          
          return (
            <motion.button
              key={devotion.day}
              id={`calendar-day-${devotion.day}`}
              onClick={() => onSelectDay(devotion.day)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={getStatusStyle(status, isSelected)}
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-2xl font-bold font-serif text-brand-medium dark:text-purple-300">
                  Día {devotion.day}
                </span>
                
                {status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-brand-medium fill-brand-medium/10" />
                )}
                {status === 'in_progress' && (
                  <Clock className="w-5 h-5 text-gold" />
                )}
                {status === 'pending' && (
                  <Circle className="w-5 h-5 text-purple-200 dark:text-purple-900" />
                )}
              </div>
              
              <div className="mt-2 text-left">
                <p className="text-xs font-semibold text-[#4A1E96] dark:text-purple-100 line-clamp-2 leading-tight">
                  {devotion.title}
                </p>
                <p className="text-[10px] text-purple-450 dark:text-purple-400 mt-1 truncate">
                  {devotion.reference}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
