import { UserProfile, MenstrualLog, WearableDataPoint } from '../types/anemia';
import { formatLocalDate } from './screeningEngine';

const USER_STORAGE_KEY = 'anemiasense_user_profile_v1';
const MENSTRUAL_STORAGE_KEY = 'anemiasense_menstrual_logs_v1';
const WEARABLE_STORAGE_KEY = 'anemiasense_wearable_logs_v1';

export const DEFAULT_USER: UserProfile = {
  name: 'Siti Nurhaliza',
  age: 25,
  email: 'siti.nurhaliza@example.com',
  avgCycleLength: 28,
  periodDuration: 5,
  baselineHR: 68,
  baselineHRV: 55,
  baselineTemp: 36.6,
  wearableDevice: 'Apple Watch Series 9',
  isWearableConnected: true,
  wearableSyncAllowed: true,
  dataSharingAllowed: false,
  disclaimerAccepted: true,
  onboardingCompleted: true,
};

export function generateDefaultData(): { user: UserProfile; menstrualLogs: MenstrualLog[]; wearableLogs: WearableDataPoint[] } {
  const today = new Date();

  // Helper date formatter YYYY-MM-DD
  const getDateStr = (offsetDays: number) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    d.setDate(d.getDate() - offsetDays);
    return formatLocalDate(d);
  };

  // Generate 30 days of Wearable logs
  const wearableLogs: WearableDataPoint[] = [];
  for (let i = 0; i < 30; i++) {
    const date = getDateStr(i);

    // Simulate elevated HR & lower HRV during period days (days 0, 1, 2, 3)
    let restingHR = 68 + Math.round((Math.random() * 4) - 2); // baseline ~68
    let hrv = 55 + Math.round((Math.random() * 6) - 3); // baseline ~55
    let skinTempDelta = Number(((Math.random() * 0.4) - 0.2).toFixed(1));
    let sleepDuration = Number((6.8 + Math.random() * 1.5).toFixed(1));
    let sleepScore = Math.round(75 + Math.random() * 20);

    // During active period (recent days 0 to 4), simulate elevated physiological strain
    if (i <= 3) {
      restingHR = 78 + Math.round(Math.random() * 4); // HR spikes to 78-82 bpm (+10-14 above baseline)
      hrv = 38 - Math.round(Math.random() * 5); // HRV drops to 33-38 ms (-17 to -22 below baseline)
      skinTempDelta = Number((0.2 + Math.random() * 0.3).toFixed(1)); // +0.2 to +0.5°C
      sleepDuration = Number((5.5 + Math.random() * 0.8).toFixed(1)); // Lower sleep
      sleepScore = 62;
    } else if (i >= 27 && i <= 30) {
      // Previous cycle period
      restingHR = 76 + Math.round(Math.random() * 3);
      hrv = 40 + Math.round(Math.random() * 4);
    }

    wearableLogs.push({
      date,
      restingHR,
      avgHR: restingHR + 14,
      hrv,
      skinTempDelta,
      sleepDuration,
      sleepScore,
      steps: 5000 + Math.round(Math.random() * 5000),
      dataQuality: 'high',
    });
  }

  // Generate Menstrual Logs (active cycle + past cycle)
  const menstrualLogs: MenstrualLog[] = [];

  // Active period (Today = Day 3 of period, very heavy/heavy flow)
  menstrualLogs.push({
    id: 'log-day-0',
    date: getDateStr(0), // Today
    isPeriodDay: true,
    flowIntensity: 'very_heavy',
    symptoms: ['fatigue', 'dizziness', 'palpitations', 'weakness'],
    notes: 'Hari ke-3 menstruasi. Terasa sangat lemas, pusing saat berdiri, dan jantung berdebar.',
  });

  menstrualLogs.push({
    id: 'log-day-1',
    date: getDateStr(1), // Yesterday
    isPeriodDay: true,
    flowIntensity: 'heavy',
    symptoms: ['fatigue', 'dizziness', 'cramps'],
    notes: 'Hari ke-2 menstruasi. Perdarahan banyak, mengganti pembalut 5x.',
  });

  menstrualLogs.push({
    id: 'log-day-2',
    date: getDateStr(2),
    isPeriodDay: true,
    flowIntensity: 'heavy',
    symptoms: ['cramps', 'headache', 'fatigue'],
    notes: 'Hari ke-1 menstruasi. Kram perut cukup hebat.',
  });

  // Previous cycle (28 days ago)
  for (let p = 0; p < 5; p++) {
    const dayOffset = 28 + p;
    menstrualLogs.push({
      id: `log-past-${p}`,
      date: getDateStr(dayOffset),
      isPeriodDay: true,
      flowIntensity: p < 2 ? 'heavy' : p === 2 ? 'moderate' : 'light',
      symptoms: p < 2 ? ['fatigue', 'cramps'] : ['headache'],
      notes: `Siklus bulan lalu hari ke-${p + 1}`,
    });
  }

  return { user: DEFAULT_USER, menstrualLogs, wearableLogs };
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const dataStr = localStorage.getItem(USER_STORAGE_KEY);
    if (dataStr) {
      return { ...DEFAULT_USER, ...JSON.parse(dataStr) };
    }
  } catch (e) {
    console.error('Error loading user profile from localStorage:', e);
  }
  return DEFAULT_USER;
}

export function saveUserProfile(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user profile to localStorage:', e);
  }
}

export function loadMenstrualLogs(): MenstrualLog[] {
  if (typeof window === 'undefined') return generateDefaultData().menstrualLogs;
  try {
    const dataStr = localStorage.getItem(MENSTRUAL_STORAGE_KEY);
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch (e) {
    console.error('Error loading menstrual logs:', e);
  }
  const defaultData = generateDefaultData();
  saveMenstrualLogs(defaultData.menstrualLogs);
  return defaultData.menstrualLogs;
}

export function saveMenstrualLogs(logs: MenstrualLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENSTRUAL_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving menstrual logs:', e);
  }
}

export function loadWearableLogs(): WearableDataPoint[] {
  if (typeof window === 'undefined') return generateDefaultData().wearableLogs;
  try {
    const dataStr = localStorage.getItem(WEARABLE_STORAGE_KEY);
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch (e) {
    console.error('Error loading wearable logs:', e);
  }
  const defaultData = generateDefaultData();
  saveWearableLogs(defaultData.wearableLogs);
  return defaultData.wearableLogs;
}

export function saveWearableLogs(logs: WearableDataPoint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WEARABLE_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving wearable logs:', e);
  }
}

export function resetAllData(): { user: UserProfile; menstrualLogs: MenstrualLog[]; wearableLogs: WearableDataPoint[] } {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(MENSTRUAL_STORAGE_KEY);
    localStorage.removeItem(WEARABLE_STORAGE_KEY);
  }
  const fresh = generateDefaultData();
  saveUserProfile(fresh.user);
  saveMenstrualLogs(fresh.menstrualLogs);
  saveWearableLogs(fresh.wearableLogs);
  return fresh;
}
