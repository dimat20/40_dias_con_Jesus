import { Devotion } from './data/devotions';

export interface DayProgress {
  read: boolean;
  reflected: boolean;
  actionCompleted: boolean;
  note: string;
  completed: boolean;
}

export interface ProgressState {
  [day: number]: DayProgress;
}

export interface ReminderSettings {
  time: string;
  enabled: boolean;
}

export type ActiveTab = 'hoy' | 'progreso' | 'recordatorio' | 'configuracion';

export type ThemeMode = 'light' | 'dark';
