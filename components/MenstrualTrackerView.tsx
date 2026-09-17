'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, FlowIntensity, SymptomType, CyclePrediction } from '../types/anemia';
import { FLOW_LABELS, SYMPTOM_LABELS, formatLocalDate, parseLocalDate } from '../lib/screeningEngine';
import { Check, Calendar as CalendarIcon, Droplets, Plus, Minus, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const [padCount, setPadCount] = useState<number>(existingLog?.padCount ?? (flowIntensity === 'very_heavy' ? 6 : flowIntensity === 'heavy' ? 4 : 2));
  const [padFullness, setPadFullness] = useState<'lightly_soaked' | 'moderately_soaked' | 'fully_soaked'>(existingLog?.padFullness ?? 'moderately_soaked');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>(existingLog?.symptoms ?? []);
  const [notes, setNotes] = useState<string>(existingLog?.notes ?? '');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSaved(false);
    const log = logs.find((l) => l.date === date);
    if (log) {
      setIsPeriodDay(log.isPeriodDay);
      setFlowIntensity(log.flowIntensity);
      setPadCount(log.padCount ?? 3);
      setPadFullness(log.padFullness ?? 'moderately_soaked');
      setSelectedSymptoms(log.symptoms);
      setNotes(log.notes || '');
    } else {
      setIsPeriodDay(true);
      setFlowIntensity('moderate');
      setPadCount(3);
      setPadFullness('moderately_soaked');
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
      padCount: isPeriodDay ? padCount : 0,
      padFullness: isPeriodDay ? padFullness : undefined,
      symptoms: selectedSymptoms,
      notes,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const flowOptions: Array<{ id: FlowIntensity; label: string; desc: string }> = [
    { id: 'light', label: 'Ringan', desc: 'Flek / 1–2 pembalut' },
    { id: 'moderate', label: 'Sedang', desc: '3–4 pembalut' },
    { id: 'heavy', label: 'Banyak', desc: '5–6 pembalut / gumpalan' },
    { id: 'very_heavy', label: 'Sangat Banyak', desc: 'Penuh < 2 jam (Tembus)' },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-rose-200">Kalender & Tracker Haid</span>
            <h2 className="text-lg font-black mt-0.5">Pencatatan Siklus PBAC</h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md grid place-items-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Date Picker Strip */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3.5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-600" />
            Pilih Tanggal Log:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Log Form Card */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-4">
          
          {/* Period Day Switch */}
          <div>
            <FieldLabel>Apakah Anda sedang haid pada tanggal ini?</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsPeriodDay(true)}
                className={`py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                  isPeriodDay
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                🔴 Ya, Sedang Haid
              </button>
              <button
                type="button"
                onClick={() => setIsPeriodDay(false)}
                className={`py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                  !isPeriodDay
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                ⚪ Tidak Haid
              </button>
            </div>
          </div>

          {/* PBAC Flow & Pad Count Tracker */}
          {isPeriodDay && (
            <div className="space-y-3 p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
              <div>
                <FieldLabel>Intensitas Perdarahan Haid</FieldLabel>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {flowOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFlowIntensity(opt.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        flowIntensity === opt.id
                          ? 'border-rose-500 bg-white dark:bg-stone-800 font-bold shadow-xs text-rose-700 dark:text-rose-300'
                          : 'border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{opt.label}</span>
                        {flowIntensity === opt.id && <Check className="w-3.5 h-3.5 text-rose-600" />}
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5 font-normal">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PBAC Pad Counter */}
              <div className="pt-2 border-t border-rose-200/50 dark:border-rose-900/40 grid grid-cols-2 gap-3 items-center">
                <div>
                  <FieldLabel>Jumlah Pembalut Diganti</FieldLabel>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPadCount(Math.max(0, padCount - 1))}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-black text-rose-600 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-black text-stone-900 dark:text-stone-100 min-w-[24px] text-center">
                      {padCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPadCount(padCount + 1)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-black text-rose-600 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <FieldLabel>Tingkat Kebasahan PBAC</FieldLabel>
                  <select
                    value={padFullness}
                    onChange={(e) => setPadFullness(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value="lightly_soaked">Sebagian Kecil (1 pt)</option>
                    <option value="moderately_soaked">Setengah Basah (5 pts)</option>
                    <option value="fully_soaked">Penuh / Tembus (20 pts)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Symptom Multi-Select */}
          <div>
            <FieldLabel>Gejala Harian & Indikator Anemia</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(Object.keys(SYMPTOM_LABELS) as SymptomType[]).map((key) => {
                const item = SYMPTOM_LABELS[key];
                const isSelected = selectedSymptoms.includes(key);
                const isAnemiaSpecific = item.severity === 'high' || key === 'fatigue' || key === 'dizziness' || key === 'cold_hands_feet';
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleSymptom(key)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{item.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    {isAnemiaSpecific && (
                      <span className="text-[9px] font-semibold text-rose-500 block mt-0.5">Spesifik Anemia</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <FieldLabel>Catatan Tambahan (Opsional)</FieldLabel>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan catatan fisik atau mood..."
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <PrimaryButton type="submit" className="w-full py-3 text-xs font-bold uppercase tracking-wider">
            Simpan Log Haid & Gejala
          </PrimaryButton>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Log berhasil disimpan!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
