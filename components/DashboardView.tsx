'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint, RiskAnalysisResult, CyclePrediction } from '../types/anemia';
import { FLOW_LABELS, SYMPTOM_LABELS, parseLocalDate } from '../lib/screeningEngine';
import { Activity, Moon, Thermometer, AlertCircle, CheckCircle2, ChevronRight, Plus, Heart } from 'lucide-react';
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
  const [showFactorsDetail, setShowFactorsDetail] = useState(true);
  const hrDelta = latestWearable ? latestWearable.restingHR - user.baselineHR : 0;
  const hrvDelta = latestWearable ? latestWearable.hrv - user.baselineHRV : 0;
  const circumference = 2 * Math.PI * 52;
  const progress = circumference - (circumference * riskResult.score) / 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[13px] text-stone-500">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Halo, {user.name}
          </h1>
          <p className="text-sm text-stone-500 max-w-xl">
            Ringkasan skrining hari ini dari siklus menstruasi dan data wearable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrimaryButton onClick={onOpenLogger}>
            <Plus className="w-4 h-4" />
            Catat haid
          </PrimaryButton>
          <GhostButton onClick={() => onNavigateTab('wearable')}>Wearable</GhostButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-5">
          <Card>
            <SectionHeader
              title="Skor skrining risiko anemia"
              hint="Berdasarkan baseline pribadi, aliran haid, dan gejala"
              action={
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${riskResult.badgeBg} ${riskResult.badgeText}`}>
                  {riskResult.category}
                </span>
              }
            />

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-stone-100 dark:text-stone-800" />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    fill="none"
                    stroke={riskResult.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight">{riskResult.score}</div>
                    <div className="text-[11px] text-stone-400">dari 100</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {riskResult.explanationText}
                </p>
                <div className="h-1.5 w-full rounded-full overflow-hidden flex bg-stone-100 dark:bg-stone-800">
                  <div className="w-[30%] bg-emerald-600" />
                  <div className="w-[30%] bg-yellow-500" />
                  <div className="w-[20%] bg-orange-500" />
                  <div className="w-[20%] bg-rose-700" />
                </div>
                <p className="text-[11px] text-stone-400">
                  0–30 rendah · 31–60 perlu diperhatikan · 61–80 tinggi · 81–100 sangat tinggi
                </p>
              </div>
            </div>

            <Notice>
              <div className="flex items-center justify-between gap-3">
                <span>Ini skrining awal, bukan diagnosis dokter.</span>
                <TextLink onClick={onOpenAiAssistant}>Tanya asisten</TextLink>
              </div>
            </Notice>
          </Card>

          <Card>
            <SectionHeader
              title="Faktor yang memengaruhi skor"
              action={
                <TextLink onClick={() => setShowFactorsDetail(!showFactorsDetail)}>
                  {showFactorsDetail ? 'Sembunyikan' : 'Tampilkan'}
                </TextLink>
              }
            />
            {showFactorsDetail && (
              <div className="space-y-2">
                {riskResult.contributingFactors.length === 0 ? (
                  <div className="py-8 text-center text-stone-500">
                    <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Tidak ada indikator abnormal</p>
                    <p className="text-[13px] mt-1">Data saat ini dekat dengan baseline Anda.</p>
                  </div>
                ) : (
                  riskResult.contributingFactors.map((factor) => (
                    <div key={factor.id} className="rounded-xl border border-stone-200 dark:border-stone-800 p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              factor.severity === 'critical'
                                ? 'text-rose-700'
                                : factor.severity === 'warning'
                                  ? 'text-amber-600'
                                  : 'text-stone-400'
                            }`}
                          />
                          <div>
                            <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100">{factor.title}</h4>
                            <p className="text-[13px] text-stone-500 mt-1 leading-relaxed">{factor.description}</p>
                          </div>
                        </div>
                        {factor.impactPoints > 0 && (
                          <span className="text-[12px] text-stone-500 shrink-0">+{factor.impactPoints}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          <Card>
            <SectionHeader title="Yang bisa dilakukan sekarang" />
            <ol className="space-y-2.5">
              {riskResult.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-stone-600 dark:text-stone-300">
                  <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] grid place-items-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ol>
            {riskResult.medicalAdviceRequired && (
              <div className="mt-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-3.5 flex items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-rose-900 dark:text-rose-200">
                  Pertimbangkan pemeriksaan hemoglobin dan ferritin di fasilitas kesehatan.
                </p>
                <GhostButton onClick={() => onNavigateTab('education')} className="shrink-0">
                  Panduan lab
                </GhostButton>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <Card>
            <SectionHeader
              title="Fisiologis hari ini"
              hint={user.isWearableConnected ? user.wearableDevice : 'Perangkat belum terhubung'}
              action={
                <TextLink onClick={() => onNavigateTab('wearable')}>
                  Kelola <ChevronRight className="w-3.5 h-3.5 inline" />
                </TextLink>
              }
            />
            {latestWearable ? (
              <div className="grid grid-cols-2 gap-2.5">
                <Metric
                  icon={<Heart className="w-3.5 h-3.5" />}
                  label="Resting HR"
                  value={String(latestWearable.restingHR)}
                  unit="bpm"
                  note={`Baseline ${user.baselineHR} · ${hrDelta >= 0 ? '+' : ''}${hrDelta}`}
                />
                <Metric
                  icon={<Activity className="w-3.5 h-3.5" />}
                  label="HRV"
                  value={String(latestWearable.hrv)}
                  unit="ms"
                  note={`Baseline ${user.baselineHRV} · ${hrvDelta >= 0 ? '+' : ''}${hrvDelta}`}
                />
                <Metric
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                  label="Suhu kulit"
                  value={(user.baselineTemp + latestWearable.skinTempDelta).toFixed(1)}
                  unit="°C"
                  note={`${latestWearable.skinTempDelta >= 0 ? '+' : ''}${latestWearable.skinTempDelta} vs baseline`}
                />
                <Metric
                  icon={<Moon className="w-3.5 h-3.5" />}
                  label="Tidur"
                  value={String(latestWearable.sleepDuration)}
                  unit="jam"
                  note={`Skor ${latestWearable.sleepScore}`}
                />
              </div>
            ) : (
              <p className="text-sm text-stone-500">Belum ada data wearable.</p>
            )}
          </Card>

          <Card>
            <SectionHeader
              title="Siklus menstruasi"
              hint={`Fase ${prediction.currentPhase} · hari ke-${prediction.currentCycleDay}`}
              action={
                <TextLink onClick={() => onNavigateTab('menstrual')}>
                  Kalender <ChevronRight className="w-3.5 h-3.5 inline" />
                </TextLink>
              }
            />
            <div className="rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Aliran hari ini</span>
                <span className="font-medium">
                  {FLOW_LABELS[todayLog?.flowIntensity ?? 'none']}
                </span>
              </div>
              {todayLog?.symptoms?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {todayLog.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[12px] bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                    >
                      {SYMPTOM_LABELS[s]?.name || s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-stone-500">Belum ada gejala tercatat hari ini.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3">
                <p className="text-[11px] text-stone-400">Haid berikutnya</p>
                <p className="text-sm font-medium mt-0.5">{formatId(prediction.nextPeriodStartDate, { day: 'numeric', month: 'short' })}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {prediction.daysUntilNextPeriod === 0
                    ? 'Hari ini'
                    : `${prediction.daysUntilNextPeriod} hari lagi`}
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3">
                <p className="text-[11px] text-stone-400">Estimasi ovulasi</p>
                <p className="text-sm font-medium mt-0.5">{formatId(prediction.ovulationDate, { day: 'numeric', month: 'short' })}</p>
              </div>
            </div>
          </Card>

          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="w-full text-left rounded-2xl border border-stone-200 dark:border-stone-800 bg-[var(--surface)] p-4 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] text-stone-500">Asisten kesehatan</p>
                <p className="text-sm font-medium mt-0.5">Tanya soal skor atau gejala Anda</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

function Metric({
  icon,
  label,
  value,
  unit,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3.5">
      <div className="flex items-center gap-1.5 text-[12px] text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-stone-400">{unit}</span>
      </div>
      <p className="text-[11px] text-stone-400 mt-1">{note}</p>
    </div>
  );
}
