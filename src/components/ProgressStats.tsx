import { motion } from 'motion/react';
import { Award, BookOpen, Calendar, Percent, ShieldCheck, Smile } from 'lucide-react';
import { ProgressState } from '../types';

interface ProgressStatsProps {
  progress: ProgressState;
  onNavigateToDay: (dayNum: number) => void;
}

export default function ProgressStats({ progress, onNavigateToDay }: ProgressStatsProps) {
  const totalDays = 40;
  const completedDays = Object.values(progress).filter(p => p.completed).length;
  const pendingDays = totalDays - completedDays;
  const percentComplete = Math.round((completedDays / totalDays) * 100);

  // Calculate current streak
  let streak = 0;
  for (let d = 1; d <= totalDays; d++) {
    if (progress[d]?.completed) {
      streak++;
    } else {
      break;
    }
  }

  // Generate motivational message
  const getMotivationalMessage = () => {
    if (completedDays === 0) {
      return {
        title: "¡Comienza tu viaje espiritual!",
        desc: "Abre el devocional del Día 1 y da el primer paso para estrechar tu relación con Dios."
      };
    } else if (percentComplete < 25) {
      return {
        title: "Paso a paso, día a día",
        desc: "¡Estás construyendo un hábito hermoso! Sigue escuchando y viviendo la Palabra de Dios."
      };
    } else if (percentComplete < 50) {
      return {
        title: "La perseverancia da frutos",
        desc: "Ya has completado más de una cuarta parte del camino. Jesús camina de tu mano."
      };
    } else if (percentComplete < 75) {
      return {
        title: "Fortalecido en la fe",
        desc: "¡Has superado la mitad de los 40 días! Tu corazón está siendo transformado."
      };
    } else if (percentComplete < 100) {
      return {
        title: "Cerca de la meta",
        desc: "¡La victoria está cerca! Sigue firme aplicando la Palabra cada día con alegría."
      };
    } else {
      return {
        title: "¡Viaje completado!",
        desc: "¡Felicidades! Has culminado los 40 Días con Jesús. Continúa esta hermosa relación diaria con Él de por vida."
      };
    }
  };

  const message = getMotivationalMessage();

  // SVG parameters for radial progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  return (
    <div id="progress-stats-view" className="space-y-8">
      {/* Overview Cards */}
      <div className="bg-gradient-to-br from-[#6b4fa3] to-[#4a1e96] text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-violet-400/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Mi Progreso Espiritual
            </span>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">
              {message.title}
            </h2>
            <p className="text-purple-100 text-sm max-w-md">
              {message.desc}
            </p>
          </div>

          {/* Radial progress */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-white/10 fill-none"
                strokeWidth="10"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-gold fill-none"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-serif text-white">{percentComplete}%</span>
              <span className="text-[10px] uppercase tracking-widest text-purple-200">Avance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#1a0e2e] p-5 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-[#6b4fa3]/10 text-brand-medium dark:text-purple-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-purple-400 font-medium">Días Completados</p>
            <p className="text-2xl font-bold font-serif text-brand-deep dark:text-purple-100">{completedDays} / 40</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#1a0e2e] p-5 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-gold-light dark:bg-gold-dark/10 text-gold-dark dark:text-gold border border-gold-border/10">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-purple-400 font-medium">Días Pendientes</p>
            <p className="text-2xl font-bold font-serif text-brand-deep dark:text-purple-100">{pendingDays}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#1a0e2e] p-5 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-purple-400 font-medium">Acciones Hechas</p>
            <p className="text-2xl font-bold font-serif text-brand-deep dark:text-purple-100">
              {Object.values(progress).filter(p => p.actionCompleted).length}
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-[#1a0e2e] p-5 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-purple-400 font-medium">Racha Inicial</p>
            <p className="text-2xl font-bold font-serif text-brand-deep dark:text-purple-100">{streak} {streak === 1 ? 'día' : 'días'}</p>
          </div>
        </motion.div>
      </div>

      {/* Progress timeline or summary notes */}
      {completedDays > 0 ? (
        <div className="bg-white dark:bg-[#1a0e2e] rounded-2xl border border-purple-100/80 dark:border-purple-950/40 p-6 shadow-xl shadow-brand-medium/5">
          <h3 className="text-lg font-serif font-bold text-brand-deep dark:text-purple-100 mb-4">
            Tus Reflexiones Guardadas
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {Object.entries(progress)
              .filter(([_, p]) => p.note && p.note.trim() !== '')
              .map(([dayNum, p]) => (
                <div key={dayNum} className="p-4 bg-brand-bg dark:bg-purple-950/20 rounded-xl border border-purple-100/30 dark:border-purple-900/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#4A1E96] dark:text-purple-300 font-serif">
                      Día {dayNum}
                    </span>
                    <button 
                      onClick={() => onNavigateToDay(Number(dayNum))}
                      className="text-xs text-purple-400 hover:text-brand-medium font-semibold underline cursor-pointer"
                    >
                      Ir al devocional
                    </button>
                  </div>
                  <p className="text-[#5a427e] dark:text-purple-200 text-sm whitespace-pre-line italic font-serif">
                    "{p.note}"
                  </p>
                </div>
              ))}
            {Object.values(progress).filter(p => p.note && p.note.trim() !== '').length === 0 && (
              <p className="text-sm text-purple-400 text-center py-4">
                No has escrito notas personales todavía. ¡Puedes escribir notas en tu devocional diario para verlas aquí!
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-brand-bg dark:bg-purple-950/20 rounded-2xl border border-dashed border-purple-150 dark:border-purple-900/40 shadow-sm">
          <Smile className="w-12 h-12 text-purple-300 dark:text-purple-800 mx-auto mb-3" />
          <p className="text-purple-400 text-sm font-medium">
            Empieza a marcar los devocionales como leídos para desbloquear tu historial y estadísticas.
          </p>
        </div>
      )}
    </div>
  );
}
