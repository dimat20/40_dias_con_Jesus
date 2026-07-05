import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Bell, BellOff, CheckCircle, HelpCircle, Save } from 'lucide-react';
import { ReminderSettings } from '../types';

interface ReminderSetupProps {
  settings: ReminderSettings;
  onSaveSettings: (settings: ReminderSettings) => void;
}

export default function ReminderSetup({ settings, onSaveSettings }: ReminderSetupProps) {
  const [time, setTime] = useState(settings.time || '07:00');
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationSupported(true);
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!notificationSupported) return;
    
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        // Trigger a test notification to confirm
        new Notification('40 Días con Jesús 🌟', {
          body: `¡Excelente! Te enviaremos un recordatorio diario a las ${time} para tu devocional.`,
          icon: '/favicon.ico'
        });
        showToast('¡Notificaciones activadas y configuradas con éxito!');
      } else if (permission === 'denied') {
        showToast('Permiso denegado. Por favor, activa las notificaciones en la configuración del navegador.');
      }
    } catch (error) {
      console.error('Error requesting notification permission', error);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      time,
      enabled: permissionStatus === 'granted'
    });
    showToast('¡Hora de recordatorio guardada con éxito!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 4000);
  };

  return (
    <div id="reminder-setup" className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-purple-100 dark:border-purple-950/40 pb-4">
        <h2 className="text-2xl font-serif font-bold text-brand-deep dark:text-purple-100 flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-medium" />
          Recordatorio Diario
        </h2>
        <p className="text-sm text-purple-400">
          Establece un momento sagrado especial cada día para meditar en la Palabra de Dios.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a0e2e] p-6 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 shadow-xl shadow-brand-medium/5 space-y-6">
        {/* Time selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-brand-deep dark:text-purple-200">
            Escoge tu hora preferida de devoción:
          </label>
          <div className="flex items-center gap-4">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-4 py-3 bg-brand-bg dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 rounded-xl text-lg font-bold text-brand-text dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-brand-medium transition-all duration-200 w-36"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#6b4fa3] to-[#4a1e96] hover:from-[#5d4193] hover:to-[#3e1485] text-white font-semibold rounded-xl shadow-md cursor-pointer transition-all duration-200"
            >
              <Save className="w-5 h-5" />
              Guardar Hora
            </motion.button>
          </div>
        </div>

        {/* Notifications details */}
        <div className="border-t border-purple-50 dark:border-purple-950/40 pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-[#6b4fa3]/10 text-brand-medium rounded-xl">
              {permissionStatus === 'granted' ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-brand-deep dark:text-purple-100">
                Notificaciones del Navegador
              </h3>
              <p className="text-xs text-purple-450 leading-relaxed">
                Nuestra app puede enviarte una notificación diaria directamente a tu celular o computadora a la hora elegida, recordándote leer la Palabra de Dios.
              </p>
            </div>
          </div>

          {notificationSupported ? (
            <div className="space-y-3">
              {permissionStatus === 'default' && (
                <div className="p-4 bg-brand-bg dark:bg-[#1a0e2e] border border-purple-100 dark:border-purple-950/40 rounded-xl space-y-3">
                  <p className="text-xs text-brand-medium dark:text-purple-300">
                    Las notificaciones están actualmente inactivas o pendientes de permiso. Haz clic abajo para permitir el acceso.
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 bg-[#6b4fa3] hover:bg-[#4a1e96] text-white text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200"
                  >
                    Activar Notificaciones
                  </button>
                </div>
              )}

              {permissionStatus === 'granted' && (
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/30 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    ¡Permiso de notificaciones concedido! Te recordaremos todos los días a las {time}.
                  </p>
                </div>
              )}

              {permissionStatus === 'denied' && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-900/30 rounded-xl space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                        Notificaciones Bloqueadas
                      </p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-450 leading-relaxed mt-1">
                        Has bloqueado los permisos de notificación de esta página. Para activarlos y recibir tu recordatorio diario:
                      </p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-amber-700 dark:text-amber-450 space-y-1 pl-1">
                    <li>Haz clic en el ícono de ajustes/candado en la barra de direcciones de tu navegador.</li>
                    <li>Cambia el ajuste de <b>Notificaciones</b> a <b>Permitir</b>.</li>
                    <li>Recarga la página para aplicar los cambios.</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-brand-bg dark:bg-[#1a0e2e] border border-purple-100/80 dark:border-purple-950/40 rounded-xl">
              <p className="text-xs text-purple-400">
                Lamentablemente, tu navegador actual o tu dispositivo no es totalmente compatible con la API de Notificaciones en segundo plano, pero puedes configurar alarmas en tu teléfono para el momento especial.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advice Card */}
      <div className="bg-white dark:bg-[#1a0e2e] p-5 rounded-2xl border border-purple-100/80 dark:border-purple-950/40 flex items-start gap-3 shadow-xl shadow-brand-medium/5">
        <HelpCircle className="w-5 h-5 text-brand-medium shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-brand-deep dark:text-purple-100">
            ¿Cómo funciona el recordatorio diario?
          </h4>
          <p className="text-[11px] text-purple-400 leading-relaxed">
            Mantén la pestaña de la aplicación abierta o activa en tu dispositivo móvil. Las notificaciones utilizan un sistema local y persisten de forma segura en tu navegador sin requerir servidores ni compartir tus datos personales con terceros.
          </p>
        </div>
      </div>

      {/* Saved Toast Alert */}
      {showSavedToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1a0e2e] text-white px-5 py-3 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-purple-950/50"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
