import { UserProfile, MenstrualLog, WearableDataPoint, RiskAnalysisResult, ContributingFactor, FlowIntensity, SymptomType, CyclePrediction } from '../types/anemia';

export const FLOW_LABELS: Record<FlowIntensity, string> = {
  none: 'Tidak haid',
  light: 'Ringan',
  moderate: 'Sedang',
  heavy: 'Berat',
  very_heavy: 'Sangat berat',
};

export const SYMPTOM_LABELS: Record<SymptomType, { name: string; desc: string; severity: 'low' | 'med' | 'high' }> = {
  fatigue: { name: 'Kelelahan (Fatigue)', desc: 'Rasa lelah berkepanjangan tanpa aktivitas berat', severity: 'med' },
  dizziness: { name: 'Pusing / Kliyengan', desc: 'Kepala terasa melayang saat berdiri atau beraktivitas', severity: 'med' },
  headache: { name: 'Sakit Kepala', desc: 'Nyeri tumpul atau berdenyut pada kepala', severity: 'low' },
  shortness_of_breath: { name: 'Sesak Napas', desc: 'Napas pendek saat beraktivitas ringan atau istirahat', severity: 'high' },
  palpitations: { name: 'Jantung Berdebar (Palpitasi)', desc: 'Detak jantung terasa kencang atau tidak teratur', severity: 'high' },
  weakness: { name: 'Lemah / Lesu', desc: 'Otot terasa lemas dan kehilangan stamina', severity: 'med' },
  cramps: { name: 'Nyeri Menstruasi (Dismenore)', desc: 'Kram pada perut bagian bawah', severity: 'low' },
  cold_hands_feet: { name: 'Tangan / Kaki Dingin', desc: 'Ujung ekstremitas terasa dingin secara tidak wajar', severity: 'med' },
  pale_skin: { name: 'Kulit Pucat / Kuku Pucat', desc: 'Warna kulit atau konjungtiva mata terlihat pucat', severity: 'high' },
};

export function calculateRiskScore(
  user: UserProfile,
  menstrualLogs: MenstrualLog[],
  wearableLogs: WearableDataPoint[],
  selectedDate: string // YYYY-MM-DD
): RiskAnalysisResult {
  const factors: ContributingFactor[] = [];
  let score = 0;

  // 1. EVALUATE MENSTRUAL FACTORS (recent 14 calendar days)
  const windowStart = addDays(selectedDate, -13);
  const recentMenstrualLogs = menstrualLogs.filter(
    (l) => l.date >= windowStart && l.date <= selectedDate
  );

  const heavyFlowDays = recentMenstrualLogs.filter(l => l.flowIntensity === 'heavy' || l.flowIntensity === 'very_heavy');
  const moderateFlowDays = recentMenstrualLogs.filter(l => l.flowIntensity === 'moderate');

  let currentPeriodLength = 0;
  for (let i = 0; i < 21; i++) {
    const d = addDays(selectedDate, -i);
    const log = menstrualLogs.find((l) => l.date === d);
    if (log?.isPeriodDay) currentPeriodLength += 1;
    else break;
  }

  if (heavyFlowDays.length >= 3) {
    const pts = Math.min(30, heavyFlowDays.length * 10);
    score += pts;
    factors.push({
      id: 'm-heavy-flow-multi',
      type: 'menstrual',
      title: 'Perdarahan Menstruasi Sangat Berat',
      description: `Anda mencatat ${heavyFlowDays.length} hari perdarahan berat/sangat berat baru-baru ini. Kehilangan darah secara signifikan meningkatkan risiko kekurangan zat besi.`,
      severity: 'critical',
      impactPoints: pts,
    });
  } else if (heavyFlowDays.length > 0) {
    const pts = heavyFlowDays.length * 8;
    score += pts;
    factors.push({
      id: 'm-heavy-flow',
      type: 'menstrual',
      title: 'Perdarahan Menstruasi Berat',
      description: `Dicatat ${heavyFlowDays.length} hari perdarahan berat. Kehilangan volume darah tinggi berpotensi menurunkan cadangan zat besi tubuh.`,
      severity: 'warning',
      impactPoints: pts,
    });
  } else if (moderateFlowDays.length >= 3) {
    score += 8;
    factors.push({
      id: 'm-mod-flow',
      type: 'menstrual',
      title: 'Menstruasi Sedang Berlangsung',
      description: 'Pencatatan siklus menunjukkan perdarahan tingkat sedang selama beberapa hari berturut-turut.',
      severity: 'info',
      impactPoints: 8,
    });
  }

  if (currentPeriodLength > 7) {
    score += 12;
    factors.push({
      id: 'm-long-duration',
      type: 'menstrual',
      title: 'Durasi Menstruasi Memanjang (>7 Hari)',
      description: `Durasi menstruasi (${currentPeriodLength} hari) melebihi batas rata-rata. Menstruasi yang berlangsung lama dapat memicu pengurasan jaringan hemoglobin.`,
      severity: 'warning',
      impactPoints: 12,
    });
  }

  // 2. EVALUATE PHYSIOLOGICAL FACTORS (Wearable data relative to baseline)
  const recentWearable = wearableLogs.find(w => w.date === selectedDate) || wearableLogs[0];

  if (recentWearable && recentWearable.dataQuality !== 'missing' && user.isWearableConnected) {
    const hrDiff = recentWearable.restingHR - user.baselineHR;
    const hrvDiff = user.baselineHRV - recentWearable.hrv; // Positive if HRV dropped below baseline

    // Heart Rate elevation check
    if (hrDiff >= 10) {
      score += 25;
      factors.push({
        id: 'p-hr-high',
        type: 'physiological',
        title: 'Resting Heart Rate Meningkat Signifikan',
        description: `Resting HR hari ini (${recentWearable.restingHR} bpm) lebih tinggi +${hrDiff} bpm dari baseline normal Anda (${user.baselineHR} bpm). Jantung bekerja lebih keras untuk memompa oksigen.`,
        severity: 'critical',
        impactPoints: 25,
      });
    } else if (hrDiff >= 5) {
      score += 15;
      factors.push({
        id: 'p-hr-mod',
        type: 'physiological',
        title: 'Resting Heart Rate Di Atas Baseline',
        description: `Resting HR hari ini (${recentWearable.restingHR} bpm) meningkat +${hrDiff} bpm dari baseline normal (${user.baselineHR} bpm).`,
        severity: 'warning',
        impactPoints: 15,
      });
    }

    // HRV drop check
    if (hrvDiff >= 15) {
      score += 20;
      factors.push({
        id: 'p-hrv-low',
        type: 'physiological',
        title: 'Heart Rate Variability (HRV) Menurun drastis',
        description: `HRV Anda (${recentWearable.hrv} ms) turun ${hrvDiff} ms di bawah baseline (${user.baselineHRV} ms), mengindikasikan beban stres fisiologis atau pemulihan tubuh yang menurun.`,
        severity: 'critical',
        impactPoints: 20,
      });
    } else if (hrvDiff >= 8) {
      score += 10;
      factors.push({
        id: 'p-hrv-mod',
        type: 'physiological',
        title: 'HRV Menurun dari Baseline',
        description: `HRV Anda (${recentWearable.hrv} ms) lebih rendah ${hrvDiff} ms dari baseline normal (${user.baselineHRV} ms).`,
        severity: 'warning',
        impactPoints: 10,
      });
    }

    // Sleep quality check
    if (recentWearable.sleepDuration < 6.0) {
      score += 8;
      factors.push({
        id: 'p-sleep-low',
        type: 'physiological',
        title: 'Durasi Tidur Rendah (< 6 jam)',
        description: `Tidur hanya ${recentWearable.sleepDuration} jam. Kurang tidur dapat memperberat rasa lelah dan mengganggu pemulihan sel darah.`,
        severity: 'info',
        impactPoints: 8,
      });
    }
  } else if (!user.isWearableConnected) {
    factors.push({
      id: 'p-no-wearable',
      type: 'physiological',
      title: 'Wearable Tidak Terhubung',
      description: 'Perangkat wearable tidak terhubung. Hubungkan smartwatch/fitness tracker untuk menyertakan Resting HR & HRV dalam skrining risiko.',
      severity: 'info',
      impactPoints: 0,
    });
  }

  // 3. EVALUATE USER-REPORTED SYMPTOMS (last 3 calendar days)
  const recentLogsWithSymptoms = menstrualLogs.filter(
    (l) => l.date >= addDays(selectedDate, -2) && l.date <= selectedDate
  );
  const reportedSymptomSet = new Set<SymptomType>();
  recentLogsWithSymptoms.forEach(log => {
    log.symptoms.forEach(s => reportedSymptomSet.add(s));
  });

  const symptomList = Array.from(reportedSymptomSet);

  if (symptomList.length > 0) {
    let symptomPoints = 0;
    const highRiskSymptoms = symptomList.filter(s => s === 'shortness_of_breath' || s === 'palpitations' || s === 'pale_skin');
    const medRiskSymptoms = symptomList.filter(s => s === 'fatigue' || s === 'dizziness' || s === 'weakness' || s === 'cold_hands_feet');

    symptomPoints += highRiskSymptoms.length * 12;
    symptomPoints += medRiskSymptoms.length * 7;
    symptomPoints = Math.min(35, symptomPoints);

    score += symptomPoints;

    const symptomNames = symptomList.map(s => SYMPTOM_LABELS[s]?.name || s).join(', ');
    factors.push({
      id: 's-reported-symptoms',
      type: 'symptoms',
      title: `Gejala Dilaporkan (${symptomList.length} Gejala)`,
      description: `Anda melaporkan gejala: ${symptomNames}. Gejala-gejala ini konsisten dengan indikator kelelahan sistemik atau berkurangnya kapasitas pembawa oksigen.`,
      severity: highRiskSymptoms.length > 0 ? 'critical' : 'warning',
      impactPoints: symptomPoints,
    });
  }

  // Cap total score at 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  // Categorize based on SRS Section 9 (FR-20)
  let category: 'Rendah' | 'Perlu Diperhatikan' | 'Tinggi' | 'Sangat Tinggi' = 'Rendah';
  let color = '#10b981'; // green
  let badgeBg = 'bg-emerald-500/10 dark:bg-emerald-500/20';
  let badgeText = 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let medicalAdviceRequired = false;

  if (finalScore >= 81) {
    category = 'Sangat Tinggi';
    color = '#ef4444'; // red
    badgeBg = 'bg-rose-500/10 dark:bg-rose-500/20';
    badgeText = 'text-rose-600 dark:text-rose-400 border-rose-500/30';
    medicalAdviceRequired = true;
  } else if (finalScore >= 61) {
    category = 'Tinggi';
    color = '#f97316'; // orange
    badgeBg = 'bg-amber-500/10 dark:bg-amber-500/20';
    badgeText = 'text-amber-600 dark:text-amber-400 border-amber-500/30';
    medicalAdviceRequired = true;
  } else if (finalScore >= 31) {
    category = 'Perlu Diperhatikan';
    color = '#eab308'; // yellow
    badgeBg = 'bg-yellow-500/10 dark:bg-yellow-500/20';
    badgeText = 'text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
    medicalAdviceRequired = false;
  }

  // Recommendations according to FR-24
  const recommendations: string[] = [];
  if (finalScore >= 61) {
    recommendations.push('Disarankan untuk berkonsultasi dengan dokter atau fasilitas kesehatan terdekat.');
    recommendations.push('Pertimbangkan untuk melakukan pemeriksaan laboratorium Darah Lengkap (Cek Hemoglobin/Hb & Ferritin).');
    recommendations.push('Perbanyak konsumsi makanan kaya zat besi (daging merah, hati, bayam, kacang-kacangan) dan Vitamin C.');
    recommendations.push('Istirahat yang cukup dan hindari aktivitas fisik yang sangat menguras energi.');
  } else if (finalScore >= 31) {
    recommendations.push('Pantau tren Resting HR dan HRV Anda dalam 2-3 hari ke depan.');
    recommendations.push('Pastikan asupan nutrisi seimbang, khususnya makanan kaya zat besi zat heme & non-heme.');
    recommendations.push('Catat perkembangan gejala dan intensitas perdarahan secara rutin.');
    recommendations.push('Jaga hidrasi cairan tubuh (minimal 2 Liter air per hari).');
  } else {
    recommendations.push('Kondisi fisiologis dan pencatatan siklus Anda berada pada tingkat risiko yang rendah.');
    recommendations.push('Tetap pertahankan pola hidup sehat, tidur teratur 7-8 jam, dan gizi seimbang.');
    recommendations.push('Lanjutkan pencatatan siklus menstruasi secara rutin di AnemiaSense.');
  }

  // Explanation text according to Section 10
  let explanationText = '';
  if (factors.length === 0) {
    explanationText = 'Belum ada faktor risiko signifikan yang terdeteksi dari data fisiologis dan siklus Anda hari ini.';
  } else {
    explanationText = `Skor risiko Anda (${finalScore}/100 - ${category}) dipengaruhi oleh ${factors.length} indikator utama. Terdeteksi perubahan pada Resting HR, HRV, atau intensitas perdarahan menstruasi yang memerlukan perhatian Anda.`;
  }

  return {
    score: finalScore,
    category,
    color,
    badgeBg,
    badgeText,
    contributingFactors: factors,
    recommendations,
    medicalAdviceRequired,
    explanationText,
    lastCalculatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(isoDate: string, days: number): string {
  const d = parseLocalDate(isoDate);
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
}

export function diffDays(fromIso: string, toIso: string): number {
  const from = parseLocalDate(fromIso);
  const to = parseLocalDate(toIso);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/** Start date of the most recent contiguous period block. */
export function findLastPeriodStart(logs: MenstrualLog[]): string | null {
  const periodDates = logs
    .filter((l) => l.isPeriodDay)
    .map((l) => l.date)
    .sort();
  if (periodDates.length === 0) return null;

  const dateSet = new Set(periodDates);
  let start = periodDates[periodDates.length - 1];
  while (dateSet.has(addDays(start, -1))) {
    start = addDays(start, -1);
  }
  return start;
}

export function calculateCyclePrediction(user: UserProfile, logs: MenstrualLog[], referenceDate: string): CyclePrediction {
  const cycleLength = user.avgCycleLength || 28;
  const duration = user.periodDuration || 5;

  let lastPeriodStart = findLastPeriodStart(logs);
  if (!lastPeriodStart) {
    lastPeriodStart = addDays(referenceDate, -10);
  }

  let nextPeriodStart = addDays(lastPeriodStart, cycleLength);
  while (diffDays(referenceDate, nextPeriodStart) < 0) {
    nextPeriodStart = addDays(nextPeriodStart, cycleLength);
  }

  const nextPeriodEnd = addDays(nextPeriodStart, duration - 1);
  const ovulationDate = addDays(nextPeriodStart, -14);
  const fertileStart = addDays(ovulationDate, -4);
  const fertileEnd = addDays(ovulationDate, 1);

  const elapsed = diffDays(lastPeriodStart, referenceDate);
  const currentCycleDay = ((elapsed % cycleLength) + cycleLength) % cycleLength + 1;
  const daysUntilNextPeriod = diffDays(referenceDate, nextPeriodStart);

  let currentPhase: 'Menstruasi' | 'Folikular' | 'Ovulasi' | 'Luteal' = 'Folikular';
  if (currentCycleDay <= duration) {
    currentPhase = 'Menstruasi';
  } else if (currentCycleDay >= 12 && currentCycleDay <= 16) {
    currentPhase = 'Ovulasi';
  } else if (currentCycleDay > 16) {
    currentPhase = 'Luteal';
  }

  return {
    nextPeriodStartDate: nextPeriodStart,
    nextPeriodEndDate: nextPeriodEnd,
    ovulationDate,
    fertileWindowStart: fertileStart,
    fertileWindowEnd: fertileEnd,
    currentCycleDay,
    daysUntilNextPeriod,
    currentPhase,
  };
}
