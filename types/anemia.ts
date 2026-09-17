export type FlowIntensity = 'none' | 'light' | 'moderate' | 'heavy' | 'very_heavy';

export type SymptomType = 
  | 'fatigue' // Kelelahan
  | 'dizziness' // Pusing
  | 'headache' // Sakit Kepala
  | 'shortness_of_breath' // Sesak Napas
  | 'palpitations' // Jantung Berdebar
  | 'weakness' // Lemah / Lesu
  | 'cramps' // Nyeri Menstruasi
  | 'cold_hands_feet' // Tangan/Kaki Dingin
  | 'pale_skin'; // Kulit Pucat

export interface UserProfile {
  name: string;
  age: number;
  email: string;
  appGoal: 'anemia_monitoring' | 'cycle_tracking' | 'both';
  anemiaHistory: 'yes' | 'no' | 'unsure';
  dietPattern: 'omnivore' | 'vegetarian' | 'vegan' | 'low_red_meat';
  ironSupplement: 'regular' | 'irregular' | 'never';
  cycleRegularity: 'regular' | 'irregular';
  avgCycleLength: number; // in days, e.g. 28
  periodDuration: number; // in days, e.g. 5
  baselineHR: number; // Resting HR baseline in bpm (e.g. 68)
  baselineHRV: number; // HRV baseline in ms (e.g. 52)
  baselineTemp: number; // Body temp baseline in °C (e.g. 36.5)
  baselineHbLab?: number; // Lab screening Hb baseline in g/dL (e.g. 12.5)
  wearableDevice: string; // 'Apple Watch' | 'Samsung Galaxy Watch' | 'Fitbit' | 'Garmin' | 'Oura Ring' | 'WHOOP' | 'None'
  isWearableConnected: boolean;
  wearableSyncAllowed: boolean;
  dataSharingAllowed: boolean;
  nakesNotificationEnabled: boolean; // Notifikasi hanya dikirim ke Nakes jika risiko tinggi
  disclaimerAccepted: boolean;
  onboardingCompleted: boolean;
}

export interface MenstrualLog {
  id: string;
  date: string; // YYYY-MM-DD
  isPeriodDay: boolean;
  flowIntensity: FlowIntensity;
  padCount?: number; // Estimasi jumlah pembalut per hari (Standar PBAC)
  padFullness?: 'lightly_soaked' | 'moderately_soaked' | 'fully_soaked';
  symptoms: SymptomType[];
  notes?: string;
}

export interface WearableDataPoint {
  date: string; // YYYY-MM-DD
  restingHR: number; // bpm
  avgHR: number; // bpm
  hrv: number; // ms
  skinTempDelta: number; // °C relative to baseline (e.g. +0.2)
  sleepDuration: number; // hours (e.g. 7.5)
  sleepScore: number; // 0-100
  steps: number;
  dataQuality: 'high' | 'medium' | 'low' | 'missing';
}

export interface ContributingFactor {
  id: string;
  type: 'menstrual' | 'physiological' | 'symptoms' | 'baseline';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  impactPoints: number;
}

export interface RiskAnalysisResult {
  score: number; // 0-100
  category: 'Rendah' | 'Perlu Diperhatikan' | 'Tinggi' | 'Sangat Tinggi';
  color: string;
  badgeBg: string;
  badgeText: string;
  contributingFactors: ContributingFactor[];
  recommendations: string[];
  medicalAdviceRequired: boolean;
  nakesAlertTriggered: boolean;
  explanationText: string;
  lastCalculatedAt: string;
}

export interface CyclePrediction {
  nextPeriodStartDate: string;
  nextPeriodEndDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  currentCycleDay: number;
  daysUntilNextPeriod: number;
  currentPhase: 'Menstruasi' | 'Folikular' | 'Ovulasi' | 'Luteal';
}

