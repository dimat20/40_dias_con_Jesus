import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calendar, 
  Bell, 
  Settings, 
  CheckCircle, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sparkles, 
  Heart, 
  Compass, 
  ChevronRight,
  BookmarkCheck,
  Award,
  BookMarked
} from 'lucide-react';

import { devotions } from './data/devotions';
import { ProgressState, ReminderSettings, ActiveTab, DayProgress } from './types';
import DevotionalCard from './components/DevotionalCard';
import CalendarView from './components/CalendarView';
import ProgressStats from './components/ProgressStats';
import ReminderSetup from './components/ReminderSetup';

// Default progress object for 40 days
const createInitialProgress = (): ProgressState => {
  const initial: ProgressState = {};
  for (let i = 1; i <= 40; i++) {
    initial[i] = {
      read: false,
      reflected: false,
      actionCompleted: false,
      note: '',
      completed: false
    };
  }
  return initial;
};

export default function App() {
  // --- Persistent State Hooks ---
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('jesus_40days_progress');
    return saved ? JSON.parse(saved) : createInitialProgress();
  });

  const [activeDay, setActiveDay] = useState<number>(() => {
    const saved = localStorage.getItem('jesus_40days_active_day');
    return saved ? Number(saved) : 1;
  });

  const [reminder, setReminder] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem('jesus_40days_reminder');
    return saved ? JSON.parse(saved) : { time: '07:00', enabled: false };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('hoy');
  const [viewingDevotion, setViewingDevotion] = useState<boolean>(false);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jesus_40days_dark_mode');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- Synchronization Effects ---
  useEffect(() => {
    localStorage.setItem('jesus_40days_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('jesus_40days_active_day', activeDay.toString());
  }, [activeDay]);

  useEffect(() => {
    localStorage.setItem('jesus_40days_reminder', JSON.stringify(reminder));
  }, [reminder]);

  useEffect(() => {
    localStorage.setItem('jesus_40days_dark_mode', darkMode.toString());
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Helper Functions ---
  const handleUpdateProgress = (dayNum: number, updates: Partial<DayProgress>) => {
    setProgress(prev => {
      const currentDay = prev[dayNum] || {
        read: false,
        reflected: false,
        actionCompleted: false,
        note: '',
        completed: false
      };
      
      const updatedDay = { ...currentDay, ...updates };
      // A day is completed if read, reflected, and actionCompleted are all true
      updatedDay.completed = !!(updatedDay.read && updatedDay.reflected && updatedDay.actionCompleted);
      
      return {
        ...prev,
        [dayNum]: updatedDay
      };
    });
  };

  const handleSaveReminderSettings = (newSettings: ReminderSettings) => {
    setReminder(newSettings);
  };

  const handleResetProgress = () => {
    setProgress(createInitialProgress());
    setActiveDay(1);
    setViewingDevotion(false);
    setActiveTab('hoy');
    setShowResetConfirm(false);
  };

  // Find the first uncompleted day to continue
  const getPendingDay = (): number => {
    for (let i = 1; i <= 40; i++) {
      if (!progress[i]?.completed) {
        return i;
      }
    }
    return 40; // Default to last day if everything is complete
  };

  const pendingDay = getPendingDay();
  const activeDevotion = devotions[activeDay - 1] || devotions[0];
  const activeProgress = progress[activeDay] || {
    read: false,
    reflected: false,
    actionCompleted: false,
    note: '',
    completed: false
  };

  // Stats
  const completedCount = (Object.values(progress) as DayProgress[]).filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / 40) * 100);

  const handleContinue = () => {
    setActiveDay(pendingDay);
    setViewingDevotion(true);
    setActiveTab('hoy');
  };

  const handleSelectDay = (dayNum: number) => {
    setActiveDay(dayNum);
    setViewingDevotion(true);
    setActiveTab('hoy');
  };

  return (
    <div id="app-root" className="min-h-screen bg-brand-bg dark:bg-[#130725] text-brand-text dark:text-purple-100 font-sans pb-24 md:pb-6 md:pl-64 transition-colors duration-300">
      
      {/* --- Sidebar Navigation (Desktop) --- */}
      <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1a0e2e] border-r border-purple-100 dark:border-purple-950/40 p-6 z-30 shadow-sm shadow-purple-100/10">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-medium dark:bg-[#4a1e96] flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
              <Sparkles className="w-5 h-5 text-gold animate-float" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#4A1E96] dark:text-purple-100 leading-none">
                40 Días con Jesús
              </h1>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1 block">
                Devocional Web
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('hoy'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'hoy'
                  ? 'bg-brand-medium/10 text-brand-medium dark:bg-purple-900/40 dark:text-purple-300 font-semibold shadow-sm'
                  : 'text-purple-400 hover:bg-brand-bg dark:hover:bg-purple-950/20 hover:text-brand-text dark:hover:text-purple-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Hoy / Devocional</span>
            </button>

            <button
              onClick={() => { setActiveTab('progreso'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'progreso'
                  ? 'bg-brand-medium/10 text-brand-medium dark:bg-purple-900/40 dark:text-purple-300 font-semibold shadow-sm'
                  : 'text-purple-400 hover:bg-brand-bg dark:hover:bg-purple-950/20 hover:text-brand-text dark:hover:text-purple-200'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Días & Progreso</span>
            </button>

            <button
              onClick={() => { setActiveTab('recordatorio'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'recordatorio'
                  ? 'bg-brand-medium/10 text-brand-medium dark:bg-purple-900/40 dark:text-purple-300 font-semibold shadow-sm'
                  : 'text-purple-400 hover:bg-brand-bg dark:hover:bg-purple-950/20 hover:text-brand-text dark:hover:text-purple-200'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Recordatorio</span>
            </button>

            <button
              onClick={() => { setActiveTab('configuracion'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'configuracion'
                  ? 'bg-brand-medium/10 text-brand-medium dark:bg-purple-900/40 dark:text-purple-300 font-semibold shadow-sm'
                  : 'text-purple-400 hover:bg-brand-bg dark:hover:bg-purple-950/20 hover:text-brand-text dark:hover:text-purple-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* Bottom controls / Theme toggle */}
        <div className="border-t border-purple-50 dark:border-purple-950/40 pt-4 flex items-center justify-between">
          <span className="text-xs text-purple-400 font-medium">Modo Visual</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-brand-bg dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[#6b4fa3] dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/30 transition-all cursor-pointer"
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* --- Header (Mobile Only) --- */}
      <header className="md:hidden flex items-center justify-between bg-white dark:bg-[#1a0e2e] px-6 py-4 border-b border-purple-100 dark:border-purple-950/40 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-medium flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-gold animate-float" />
          </div>
          <span className="font-serif font-bold text-base text-brand-deep dark:text-purple-100">
            40 Días con Jesús
          </span>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-brand-bg dark:bg-purple-950/40 text-[#6b4fa3] dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/30 cursor-pointer"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* --- Main Content Area --- */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'hoy' && (
            <motion.div
              key="hoy-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {!viewingDevotion ? (
                /* Welcome Screen */
                <div id="welcome-panel" className="space-y-8">
                  {/* Hero banner card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-xl h-60 sm:h-80 flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-br from-[#1a0e2e] to-[#4a1e96]">
                    <img
                      src="/img_devotional_hero.jpg"
                      alt="Jesús sendero de luz"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e2e] via-transparent to-transparent" />
                    
                    <div className="relative space-y-3 z-10">
                      <span className="inline-block bg-white/20 backdrop-blur-md text-gold-light border border-white/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Un camino espiritual de 40 días
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight drop-shadow-md">
                        40 Días con Jesús
                      </h2>
                      <p className="text-purple-200 text-sm sm:text-base max-w-lg leading-relaxed drop-shadow">
                        Un camino diario para escuchar, meditar y vivir la Palabra de Dios.
                      </p>
                    </div>
                  </div>

                  {/* Progress dashboard card */}
                  <div className="bg-white dark:bg-[#1a0e2e] p-6 rounded-3xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">
                          Tu Progreso Actual
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-[#4A1E96] dark:text-purple-100 mt-1">
                          {completedCount === 40 
                            ? "¡Has completado el viaje! 🌟" 
                            : `Día ${pendingDay} de 40 pendiente`}
                        </h3>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleContinue}
                        className="px-6 py-3 bg-[#6b4fa3] hover:bg-[#5a427e] text-white font-bold rounded-2xl shadow-lg shadow-purple-200/50 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>
                          {completedCount === 0 
                            ? "Iniciar Día 1" 
                            : completedCount === 40 
                              ? "Repasar Devocionales" 
                              : `Continuar Día ${pendingDay}`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-purple-400">
                        <span>{progressPercent}% completado</span>
                        <span>{completedCount} de 40 días</span>
                      </div>
                      <div className="h-3 w-full bg-purple-50 dark:bg-purple-950/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#6b4fa3] to-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-white dark:bg-[#1a0e2e] rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 flex gap-4">
                      <div className="p-3 bg-gold-light dark:bg-gold-dark/10 text-gold-dark dark:text-gold rounded-xl shrink-0 h-12 w-12 flex items-center justify-center border border-gold-border/20">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#4A1E96] dark:text-purple-100">Estrecha tu Relación</h4>
                        <p className="text-xs text-purple-400 mt-1 leading-relaxed">
                          Descubre promesas bíblicas diarias y dedícale un tiempo de oración constante a Jesús.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-white dark:bg-[#1a0e2e] rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 flex gap-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center border border-emerald-100/20">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#4A1E96] dark:text-purple-100">Acciones de Fe</h4>
                        <p className="text-xs text-purple-400 mt-1 leading-relaxed">
                          Pon en práctica la Palabra mediante un acto de bondad, servicio o gratitud diario.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Devotional reading panel */
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <button
                      onClick={() => setViewingDevotion(false)}
                      className="text-xs font-bold text-purple-450 dark:text-purple-350 hover:text-brand-medium flex items-center gap-1 bg-white dark:bg-[#1a0e2e] border border-purple-100/80 dark:border-purple-950/40 px-3 py-1.5 rounded-xl cursor-pointer hover:border-purple-200 shadow-sm transition-all"
                    >
                      ← Volver al Inicio
                    </button>
                  </div>
                  <DevotionalCard
                    devotion={activeDevotion}
                    progress={activeProgress}
                    onUpdateProgress={handleUpdateProgress}
                    onPrevDay={() => {
                      if (activeDay > 1) setActiveDay(activeDay - 1);
                    }}
                    onNextDay={() => {
                      if (activeDay < 40) setActiveDay(activeDay + 1);
                    }}
                    isFirstDay={activeDay === 1}
                    isLastDay={activeDay === 40}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'progreso' && (
            <motion.div
              key="progreso-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Tabs selector within Progress */}
              <div className="space-y-6">
                <ProgressStats 
                  progress={progress} 
                  onNavigateToDay={(d) => {
                    setActiveDay(d);
                    setViewingDevotion(true);
                    setActiveTab('hoy');
                  }}
                />
                
                {/* 40-Day Calendar Grid */}
                <CalendarView
                  progress={progress}
                  activeDay={activeDay}
                  onSelectDay={handleSelectDay}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'recordatorio' && (
            <motion.div
              key="recordatorio-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReminderSetup
                settings={reminder}
                onSaveSettings={handleSaveReminderSettings}
              />
            </motion.div>
          )}

          {activeTab === 'configuracion' && (
            <motion.div
              key="configuracion-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-purple-100 dark:border-purple-950/40 pb-4">
                <h2 className="text-2xl font-serif font-bold text-brand-deep dark:text-purple-100 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-brand-medium" />
                  Configuración
                </h2>
                <p className="text-sm text-purple-400">
                  Ajustes de la aplicación y control de datos.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a0e2e] rounded-2xl border border-purple-100/80 dark:border-purple-950/40 p-6 shadow-xl shadow-brand-medium/5 space-y-6">
                {/* Summary status in config */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-[#4A1E96] dark:text-purple-200 text-sm uppercase tracking-wider">
                    Resumen de Progreso
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-brand-bg dark:bg-purple-950/40 rounded-xl border border-purple-100/30 dark:border-purple-900/10">
                      <p className="text-lg font-serif font-bold text-brand-medium dark:text-purple-350">{completedCount}</p>
                      <p className="text-[10px] text-purple-400 font-medium">Completados</p>
                    </div>
                    <div className="p-3 bg-brand-bg dark:bg-purple-950/40 rounded-xl border border-purple-100/30 dark:border-purple-900/10">
                      <p className="text-lg font-serif font-bold text-purple-400 dark:text-purple-200">{40 - completedCount}</p>
                      <p className="text-[10px] text-purple-400 font-medium">Pendientes</p>
                    </div>
                    <div className="p-3 bg-brand-bg dark:bg-purple-950/40 rounded-xl border border-purple-100/30 dark:border-purple-900/10">
                      <p className="text-lg font-serif font-bold text-gold-dark dark:text-gold">{progressPercent}%</p>
                      <p className="text-[10px] text-purple-400 font-medium">Porcentaje</p>
                    </div>
                  </div>
                </div>

                {/* Dark Mode toggle */}
                <div className="border-t border-purple-100/80 dark:border-purple-950/40 pt-6 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-[#4A1E96] dark:text-purple-100 text-sm">Tema Oscuro</h4>
                    <p className="text-xs text-purple-400">Cambia la apariencia visual de la aplicación.</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-bg dark:bg-purple-950/40 text-brand-text dark:text-purple-300 border border-purple-100/80 dark:border-purple-900/30 cursor-pointer text-xs font-semibold"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                    <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                  </button>
                </div>

                {/* Reset Progress Option */}
                <div className="border-t border-purple-100/80 dark:border-purple-950/40 pt-6 space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-rose-600 text-sm">Zona de Riesgo</h4>
                    <p className="text-xs text-purple-400">Reinicia todos tus datos de avance, notas y configuración.</p>
                  </div>

                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 rounded-xl text-xs font-semibold border border-rose-200/50 dark:border-rose-900/50 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reiniciar todo mi progreso
                    </button>
                  ) : (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl space-y-3">
                      <p className="text-xs text-rose-800 dark:text-rose-300 font-semibold">
                        ¿Estás absolutamente seguro de que deseas reiniciar tu progreso?
                      </p>
                      <p className="text-[11px] text-rose-600 dark:text-rose-450 leading-relaxed">
                        Esta acción es irreversible y borrará los registros de los 40 días, tus respuestas escritas, oraciones y notas guardadas.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleResetProgress}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl cursor-pointer"
                        >
                          Sí, reiniciar progreso
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Devotional metadata info */}
              <div className="bg-white dark:bg-[#1a0e2e] p-5 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 text-center space-y-2 shadow-xl shadow-brand-medium/5">
                <BookMarked className="w-8 h-8 text-brand-medium mx-auto" />
                <h4 className="text-xs font-serif font-bold text-brand-deep dark:text-purple-100">
                  Acerca de &ldquo;40 Días con Jesús&rdquo;
                </h4>
                <p className="text-[10px] text-purple-400 leading-relaxed max-w-md mx-auto">
                  Esta aplicación fue diseñada para guiarte en una meditación profunda y constante durante 40 días. Cada jornada está centrada en las promesas bíblicas divinas y la presencia de nuestro Señor Jesucristo.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Tab Navigation (Mobile Bottom Bar) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#1a0e2e] border-t border-purple-100 dark:border-purple-950/40 flex justify-around py-3 px-2 z-40 shadow-xl backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
        <button
          onClick={() => { setActiveTab('hoy'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeTab === 'hoy' ? 'text-brand-medium dark:text-purple-300 font-bold' : 'text-purple-300'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Hoy</span>
        </button>

        <button
          onClick={() => { setActiveTab('progreso'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeTab === 'progreso' ? 'text-brand-medium dark:text-purple-300 font-bold' : 'text-purple-300'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Progreso</span>
        </button>

        <button
          onClick={() => { setActiveTab('recordatorio'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeTab === 'recordatorio' ? 'text-brand-medium dark:text-purple-300 font-bold' : 'text-purple-300'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Alarma</span>
        </button>

        <button
          onClick={() => { setActiveTab('configuracion'); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
            activeTab === 'configuracion' ? 'text-brand-medium dark:text-purple-300 font-bold' : 'text-purple-300'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
