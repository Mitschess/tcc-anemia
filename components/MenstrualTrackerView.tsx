'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, FlowIntensity, SymptomType, CyclePrediction } from '../types/anemia';
import { FLOW_LABELS, SYMPTOM_LABELS, formatLocalDate, parseLocalDate } from '../lib/screeningEngine';
import { Check } from 'lucide-react';

import { Card, FieldLabel, Notice, PageIntro, PrimaryButton, inputClass } from './ui';

interface MenstrualTrackerProps {
  user: UserProfile;
  logs: MenstrualLog[];
  prediction: CyclePrediction;
  onSaveLog: (log: MenstrualLog) => void;
}

export const MenstrualTrackerView: React.FC<MenstrualTrackerProps> = ({
  user,
  logs,
  prediction,
  onSaveLog,
}) => {
  const localToday = formatLocalDate(new Date());

  const [selectedDate, setSelectedDate] = useState(localToday);
  const existingLog = logs.find((l) => l.date === selectedDate);
  const [saved, setSaved] = useState(false);

  const [isPeriodDay, setIsPeriodDay] = useState<boolean>(existingLog?.isPeriodDay ?? true);
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>(existingLog?.flowIntensity ?? 'heavy');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>(existingLog?.symptoms ?? []);
  const [notes, setNotes] = useState<string>(existingLog?.notes ?? '');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSaved(false);
    const log = logs.find((l) => l.date === date);
    if (log) {
      setIsPeriodDay(log.isPeriodDay);
      setFlowIntensity(log.flowIntensity);
      setSelectedSymptoms(log.symptoms);
      setNotes(log.notes || '');
    } else {
      setIsPeriodDay(true);
      setFlowIntensity('moderate');
      setSelectedSymptoms([]);
      setNotes('');
    }
  };

  const toggleSymptom = (symptomKey: SymptomType) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomKey) ? prev.filter((s) => s !== symptomKey) : [...prev, symptomKey]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({
      id: existingLog?.id || `log-${Date.now()}`,
      date: selectedDate,
      isPeriodDay,
      flowIntensity: isPeriodDay ? flowIntensity : 'none',
      symptoms: selectedSymptoms,
      notes,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const flowOptions: Array<{ id: FlowIntensity; label: string; desc: string }> = [
    { id: 'light', label: 'Ringan', desc: 'Ganti pembalut 1–2× / hari' },
    { id: 'moderate', label: 'Sedang', desc: 'Ganti pembalut 3–4× / hari' },
    { id: 'heavy', label: 'Berat', desc: 'Ganti pembalut 5–6× / hari' },
    { id: 'very_heavy', label: 'Sangat berat', desc: 'Penuh dalam <2 jam atau gumpalan' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro
        title="Pencatatan siklus"
        description={`Catat aliran dan gejala harian. Siklus rata-rata Anda ${user.avgCycleLength} hari, durasi haid ${user.periodDuration} hari.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card className="lg:col-span-7">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="text-sm font-semibold">Catatan harian</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              className={`${inputClass} w-auto`}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <FieldLabel>Sedang haid pada tanggal ini?</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPeriodDay(true)}
                  className={`py-2.5 rounded-lg text-sm font-medium cursor-pointer border ${
                    isPeriodDay
                      ? 'bg-[#9f2d3a] text-white border-[#9f2d3a]'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600'
                  }`}
                >
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() => setIsPeriodDay(false)}
                  className={`py-2.5 rounded-lg text-sm font-medium cursor-pointer border ${
                    !isPeriodDay
                      ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600'
                  }`}
                >
                  Tidak
                </button>
              </div>
            </div>

            {isPeriodDay && (
              <div>
                <FieldLabel>Intensitas aliran</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {flowOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFlowIntensity(opt.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer ${
                        flowIntensity === opt.id
                          ? 'border-[#9f2d3a] bg-rose-50/70 dark:bg-rose-950/20'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{opt.label}</span>
                        {flowIntensity === opt.id && <Check className="w-4 h-4 text-[#9f2d3a]" />}
                      </div>
                      <span className="text-[12px] text-stone-500 mt-1 block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <FieldLabel>Gejala yang dirasakan</FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(SYMPTOM_LABELS) as SymptomType[]).map((key) => {
                  const item = SYMPTOM_LABELS[key];
                  const isSelected = selectedSymptoms.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleSymptom(key)}
                      className={`p-2.5 rounded-lg border text-left text-sm cursor-pointer flex items-start gap-2 ${
                        isSelected
                          ? 'border-[#9f2d3a] bg-rose-50/70 dark:bg-rose-950/20'
                          : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border mt-0.5 grid place-items-center shrink-0 ${
                          isSelected ? 'bg-[#9f2d3a] border-[#9f2d3a] text-white' : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </span>
                      <span>
                        <span className="block font-medium">{item.name}</span>
                        <span className="block text-[12px] text-stone-500">{item.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel>Catatan (opsional)</FieldLabel>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misalnya: pusing saat berdiri, kurang tidur…"
                className={inputClass}
              />
            </div>

            {saved && <Notice tone="ok">Catatan {selectedDate} tersimpan.</Notice>}

            <PrimaryButton type="submit" className="w-full">
              Simpan catatan
            </PrimaryButton>
          </form>
        </Card>

        <div className="lg:col-span-5 space-y-5">
          <Card>
            <h2 className="text-sm font-semibold mb-3">Prediksi siklus</h2>
            <div className="space-y-2.5 text-sm">
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-stone-400">Haid berikutnya</p>
                  <p className="font-medium mt-0.5">
                    {parseLocalDate(prediction.nextPeriodStartDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <span className="text-[12px] text-stone-500">
                  {prediction.daysUntilNextPeriod === 0 ? 'Hari ini' : `${prediction.daysUntilNextPeriod} hari`}
                </span>
              </div>
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3.5">
                <p className="text-[12px] text-stone-400">Jendela ovulasi</p>
                <p className="font-medium mt-0.5">
                  {parseLocalDate(prediction.ovulationDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
                <p className="text-[12px] text-stone-500 mt-1">
                  Subur{' '}
                  {parseLocalDate(prediction.fertileWindowStart).toLocaleDateString('id-ID', { day: 'numeric' })}–
                  {parseLocalDate(prediction.fertileWindowEnd).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold mb-3">Riwayat terbaru</h2>
            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {logs.length === 0 && <p className="text-sm text-stone-500">Belum ada catatan.</p>}
              {logs
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 12)
                .map((log) => (
                  <button
                    type="button"
                    key={log.id}
                    onClick={() => handleDateSelect(log.date)}
                    className={`w-full text-left p-3 rounded-xl border text-sm cursor-pointer ${
                      selectedDate === log.date
                        ? 'border-[#9f2d3a] bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {parseLocalDate(log.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[12px] text-stone-500">{FLOW_LABELS[log.flowIntensity]}</span>
                    </div>
                    {log.symptoms.length > 0 && (
                      <p className="mt-1 text-[12px] text-stone-500">
                        {log.symptoms.map((s) => SYMPTOM_LABELS[s]?.name || s).join(' · ')}
                      </p>
                    )}
                  </button>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
