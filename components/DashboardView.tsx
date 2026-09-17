'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint, RiskAnalysisResult, CyclePrediction } from '../types/anemia';
import { FLOW_LABELS, SYMPTOM_LABELS, parseLocalDate } from '../lib/screeningEngine';
import {
  Activity,
  Moon,
  Thermometer,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  Heart,
  ShieldAlert,
  Stethoscope,
  Sparkles,
  Zap,
  TrendingUp,
  Droplets,
  Calendar,
  Flame,
} from 'lucide-react';
import { Card, GhostButton, Notice, PrimaryButton, SectionHeader, TextLink } from './ui';

interface DashboardProps {
  user: UserProfile;
  riskResult: RiskAnalysisResult;
  prediction: CyclePrediction;
  latestWearable: WearableDataPoint | undefined;
  todayLog: MenstrualLog | undefined;
  onOpenLogger: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
}

function formatId(dateStr: string, opts?: Intl.DateTimeFormatOptions) {
  return parseLocalDate(dateStr).toLocaleDateString('id-ID', opts ?? { day: 'numeric', month: 'short' });
}

export const DashboardView: React.FC<DashboardProps> = ({
  user,
  riskResult,
  prediction,
  latestWearable,
  todayLog,
  onOpenLogger,
  onNavigateTab,
  onOpenAiAssistant,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [showNakesModal, setShowNakesModal] = useState(false);

  const isHighRisk = riskResult.score >= 61;
  const isModerateRisk = riskResult.score >= 31 && riskResult.score < 61;

  // Generate 7 days strip
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const offset = idx - 3;
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return {
      offset,
      dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      dateNum: d.getDate(),
      isToday: offset === 0,
    };
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. DYNAMIC WEEK STRIP CAROUSEL */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-2xl p-2 border border-rose-100 dark:border-stone-800 shadow-xs">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Jadwal Siklus Minggu Ini
          </span>
          <span className="text-[10px] text-stone-400 font-medium">Hari ke-{prediction.currentCycleDay}</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((item) => {
            const isSelected = selectedDayOffset === item.offset;
            return (
              <button
                key={item.offset}
                onClick={() => setSelectedDayOffset(item.offset)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white font-bold shadow-md shadow-rose-500/25 scale-105'
                    : item.isToday
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900'
                      : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-[10px] uppercase font-medium">{item.dayName}</span>
                <span className="text-sm font-black mt-0.5">{item.dateNum}</span>
                {item.isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-rose-500 mt-1 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. HERO FLO-STYLE CIRCULAR CYCLING WIDGET */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white p-6 shadow-xl shadow-rose-500/15">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-semibold text-rose-100 uppercase tracking-widest mb-3">
            <Flame className="w-3 h-3 text-amber-300 animate-bounce" />
            Fase {prediction.currentPhase}
          </div>

          <div className="relative w-44 h-44 my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - prediction.currentCycleDay / user.avgCycleLength)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {prediction.daysUntilNextPeriod === 0 ? (
                <div>
                  <span className="text-xl font-black">Haid Hari Ini</span>
                  <p className="text-[11px] text-rose-100">Hari ke-{prediction.currentCycleDay}</p>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] text-rose-100">Haid berikutnya</span>
                  <div className="text-4xl font-black tracking-tight leading-none my-1">
                    {prediction.daysUntilNextPeriod}
                  </div>
                  <span className="text-[10px] text-rose-200">hari lagi</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenLogger}
            className="mt-2 px-5 py-2 rounded-full text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 shadow-lg shadow-black/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Catat Haid & Gejala Hari Ini
          </button>

          <div className="mt-4 flex items-center gap-4 text-xs text-rose-100/90 pt-3 border-t border-white/15 w-full justify-center">
            <span className="flex items-center gap-1">
              👟 <strong>{latestWearable?.steps || 0}</strong> langkah
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ❤️ <strong>{latestWearable?.restingHR || user.baselineHR}</strong> bpm
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ⚡ <strong>{latestWearable?.hrv || user.baselineHRV}</strong> ms HRV
            </span>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC ANEMIA RISK STATUS CARD */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-300 shadow-sm ${
          isHighRisk
            ? 'border-rose-500 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-lg shadow-rose-500/20'
            : isModerateRisk
              ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100'
              : 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 text-stone-900 dark:text-stone-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isHighRisk ? (
              <ShieldAlert className="w-5 h-5 text-rose-200 animate-bounce" />
            ) : isModerateRisk ? (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            ) : (
              <Sparkles className="w-5 h-5 text-emerald-600" />
            )}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider">
                Status Risiko Anemia
              </h3>
              <p className="text-sm font-black mt-0.5">{riskResult.category}</p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                isHighRisk
                  ? 'bg-white/20 text-white border border-white/30'
                  : isModerateRisk
                    ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                    : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              Skor {riskResult.score}/100
            </span>
          </div>
        </div>

        <p className={`text-xs mt-2.5 leading-relaxed ${isHighRisk ? 'text-rose-100' : 'text-stone-600 dark:text-stone-300'}`}>
          {riskResult.explanationText}
        </p>

        {riskResult.nakesAlertTriggered && (
          <div className="mt-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-white shrink-0" />
              <span className="font-semibold">Alert Terkirim ke Nakes</span>
            </div>
            <button
              onClick={() => setShowNakesModal(true)}
              className="px-2.5 py-1 rounded-lg bg-white text-rose-700 text-[10px] font-bold hover:bg-rose-50 cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>
        )}
      </div>

      {/* 4. DYNAMIC PPG / HEART RATE LIVE WAVE ANIMATION WIDGET */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600 animate-pulse" />
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Sensor Fisiologis Wearable PPG
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
            Live Connected
          </span>
        </div>

        <div className="relative h-16 w-full overflow-hidden rounded-xl bg-stone-950 p-2 flex items-center">
          <svg className="w-full h-12" viewBox="0 0 300 40" preserveAspectRatio="none">
            <path
              d="M0 20 L40 20 L50 10 L60 30 L70 5 L80 35 L90 20 L150 20 L160 12 L170 28 L180 8 L190 32 L200 20 L300 20"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute right-4 text-right">
            <span className="text-lg font-black text-rose-500 leading-none block">
              {latestWearable?.restingHR || user.baselineHR}
            </span>
            <span className="text-[9px] text-stone-400 font-medium uppercase">bpm</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">Resting HR</span>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {latestWearable?.restingHR || user.baselineHR} bpm
            </span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">HRV Baseline</span>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {latestWearable?.hrv || user.baselineHRV} ms
            </span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">Suhu Kulit</span>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {(user.baselineTemp + (latestWearable?.skinTempDelta || 0)).toFixed(1)} °C
            </span>
          </div>
        </div>
      </div>

      {/* MODAL SIMULASI DASHBOARD NAKES */}
      {showNakesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Portal Tenaga Kesehatan</h3>
              </div>
              <button
                onClick={() => setShowNakesModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 dark:text-rose-200">Alert Risiko Tinggi:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                    Aktif
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300">
                  Pasien: <strong>{user.name}</strong> ({user.age} thn)<br />
                  Skor Anemia: <strong>{riskResult.score}/100 ({riskResult.category})</strong><br />
                  Heart Rate: <strong>{latestWearable?.restingHR || user.baselineHR} bpm</strong> (Baseline {user.baselineHR} bpm)
                </p>
              </div>

              <p className="text-stone-500 text-[11px]">
                Notifikasi dikirim secara otomatis ke klinik/nakes untuk pemantauan klinis lebih lanjut.
              </p>
            </div>

            <button
              onClick={() => setShowNakesModal(false)}
              className="w-full py-2.5 rounded-xl font-bold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs shadow-xs"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
