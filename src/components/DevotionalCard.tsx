import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  PenTool, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Quote, 
  Compass, 
  Activity 
} from 'lucide-react';
import { Devotion } from '../data/devotions';
import { DayProgress } from '../types';

interface DevotionalCardProps {
  devotion: Devotion;
  progress: DayProgress;
  onUpdateProgress: (dayNum: number, updates: Partial<DayProgress>) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  isFirstDay: boolean;
  isLastDay: boolean;
}

export default function DevotionalCard({
  devotion,
  progress,
  onUpdateProgress,
  onPrevDay,
  onNextDay,
  isFirstDay,
  isLastDay
}: DevotionalCardProps) {
  const [noteText, setNoteText] = useState(progress.note || '');

  // Synchronize state when devotion day changes
  useEffect(() => {
    setNoteText(progress.note || '');
  }, [devotion.day, progress.note]);

  const handleCheckboxToggle = (field: 'read' | 'reflected' | 'actionCompleted') => {
    const nextState = { ...progress };
    nextState[field] = !progress[field];
    
    // Check if fully completed
    const isCompleted = nextState.read && nextState.reflected && nextState.actionCompleted;
    onUpdateProgress(devotion.day, {
      [field]: !progress[field],
      completed: isCompleted
    });
  };

  const handleNoteChange = (text: string) => {
    setNoteText(text);
    onUpdateProgress(devotion.day, { note: text });
  };

  return (
    <div id={`devotional-card-${devotion.day}`} className="max-w-3xl mx-auto space-y-6">
      {/* Day Selector Navigation Header */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1a0e2e] p-4 rounded-2xl border border-purple-100 dark:border-purple-950/40 shadow-sm shadow-purple-100/5">
        <button
          onClick={onPrevDay}
          disabled={isFirstDay}
          className="p-2 text-purple-400 hover:text-brand-medium dark:hover:text-purple-300 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
          title="Día anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-medium dark:text-purple-350">
            Devocional Diario
          </span>
          <h1 className="text-xl font-serif font-bold text-brand-deep dark:text-purple-100">
            Día {devotion.day} de 40
          </h1>
        </div>

        <button
          onClick={onNextDay}
          disabled={isLastDay}
          className="p-2 text-purple-400 hover:text-brand-medium dark:hover:text-purple-300 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
          title="Siguiente día"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={devotion.day}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Main Content card */}
          <div className="bg-white dark:bg-[#1a0e2e] rounded-[32px] border border-purple-100 dark:border-purple-950/40 shadow-2xl shadow-purple-900/5 overflow-hidden flex flex-col">
            
            {/* Gradient Header Area (Matches Design HTML) */}
            <div className="bg-gradient-to-br from-[#6b4fa3] to-[#4a1e96] p-6 sm:p-8 text-white relative">
              <div className="flex justify-between items-start mb-4 pr-24">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-purple-100">
                  Día {devotion.day} de 40
                </div>
              </div>

              {/* Top progress status badge */}
              <div className="absolute right-4 top-6 sm:right-8 sm:top-8">
                {progress.completed ? (
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Completado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    En proceso
                  </span>
                )}
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3 text-white leading-tight">
                {devotion.title}
              </h2>

              <div className="relative mt-4 border-l-2 border-gold/60 pl-4 py-1">
                <Quote className="absolute right-0 top-0 w-8 h-8 text-white/5 pointer-events-none" />
                <p className="text-base sm:text-lg font-serif italic text-purple-100 leading-relaxed pr-4">
                  "{devotion.verse}"
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-widest">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{devotion.reference}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Spiritual Reflection */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-medium dark:text-purple-300 flex items-center gap-1.5 border-b border-purple-50 dark:border-purple-950/40 pb-2">
                  <Compass className="w-4 h-4" />
                  Reflexión Espiritual
                </h3>
                <p className="text-[#5a427e] dark:text-purple-200 text-base leading-relaxed whitespace-pre-line font-serif text-justify">
                  {devotion.reflection}
                </p>
              </div>

              {/* Personal Question & Practical Action in visual grid blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50/50 dark:bg-purple-950/10 p-5 rounded-2xl border border-purple-100/50 dark:border-purple-900/20 space-y-3">
                  <h4 className="text-[10px] uppercase tracking-widest text-purple-400 dark:text-purple-350 font-black mb-2 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-purple-400 fill-purple-400/10" />
                    Para Meditar
                  </h4>
                  <p className="text-[#4A1E96] dark:text-purple-200 text-sm font-serif italic leading-relaxed">
                    {devotion.question}
                  </p>
                </div>

                <div className="bg-[#fef9eb] dark:bg-gold-dark/5 p-5 rounded-2xl border border-[#f5e6b3] dark:border-gold-border/20 space-y-3">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#b8860b] dark:text-gold font-black mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-gold-dark" />
                    Acción Práctica
                  </h4>
                  <p className="text-[#7a5c00] dark:text-purple-200 text-sm leading-relaxed">
                    {devotion.action}
                  </p>
                </div>
              </div>

              {/* Action Checkbox Controls */}
              <div className="border-t border-purple-50 dark:border-purple-950/40 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-brand-deep dark:text-purple-100 uppercase tracking-wider">
                  Control de Avance Diario
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleCheckboxToggle('read')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      progress.read
                        ? 'bg-[#6b4fa3]/10 border-brand-medium text-[#6b4fa3] dark:text-purple-300 font-semibold shadow-sm'
                        : 'bg-brand-bg dark:bg-purple-950/40 border-purple-100 dark:border-purple-950/40 text-purple-400 hover:border-brand-medium'
                    }`}
                  >
                    {progress.read ? (
                      <CheckSquare className="w-5 h-5 shrink-0 text-brand-medium dark:text-purple-300" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0 text-purple-300" />
                    )}
                    <span className="text-sm">1. He leído la Palabra</span>
                  </button>

                  <button
                    onClick={() => handleCheckboxToggle('reflected')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      progress.reflected
                        ? 'bg-[#6b4fa3]/10 border-brand-medium text-[#6b4fa3] dark:text-purple-300 font-semibold shadow-sm'
                        : 'bg-brand-bg dark:bg-purple-950/40 border-purple-100 dark:border-purple-950/40 text-purple-400 hover:border-brand-medium'
                    }`}
                  >
                    {progress.reflected ? (
                      <CheckSquare className="w-5 h-5 shrink-0 text-brand-medium dark:text-purple-300" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0 text-purple-300" />
                    )}
                    <span className="text-sm">2. He reflexionado</span>
                  </button>

                  <button
                    onClick={() => handleCheckboxToggle('actionCompleted')}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      progress.actionCompleted
                        ? 'bg-[#6b4fa3]/10 border-brand-medium text-[#6b4fa3] dark:text-purple-300 font-semibold shadow-sm'
                        : 'bg-brand-bg dark:bg-purple-950/40 border-purple-100 dark:border-purple-950/40 text-purple-400 hover:border-brand-medium'
                    }`}
                  >
                    {progress.actionCompleted ? (
                      <CheckSquare className="w-5 h-5 shrink-0 text-brand-medium dark:text-purple-300" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0 text-purple-300" />
                    )}
                    <span className="text-sm">3. He hecho la acción</span>
                  </button>
                </div>

                {progress.completed && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-[#fef9eb] dark:bg-gold-dark/10 border border-[#f5e6b3] dark:border-gold-border/20 rounded-2xl text-center text-[#7a5c00] dark:text-gold"
                  >
                    <p className="text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5 text-gold" />
                      ¡GLORIA A DIOS! HAS COMPLETADO EL DEVOCIONAL DEL DÍA {devotion.day}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Personal Notes Box */}
              <div className="border-t border-purple-100 dark:border-purple-950/40 pt-6 space-y-3">
                <h4 className="text-sm font-bold text-brand-deep dark:text-purple-100 uppercase tracking-wider flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-brand-medium" />
                  Mis Notas Personales
                </h4>
                <textarea
                  value={noteText}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Escribe aquí tu oración, compromiso o respuesta a la pregunta del día..."
                  rows={4}
                  className="w-full px-4 py-3 bg-brand-bg dark:bg-purple-950/40 border border-purple-100/85 dark:border-purple-900/30 rounded-2xl text-[#331c52] dark:text-purple-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium focus:bg-white dark:focus:bg-[#1a0e2e] transition-all duration-200 placeholder:text-purple-400/60 font-serif"
                />
                <p className="text-[10px] text-purple-450 dark:text-purple-400 text-right">
                  Tus notas se guardan automáticamente y permanecen seguras en este dispositivo.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
