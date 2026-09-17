'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, WearableDataPoint } from '../types/anemia';
import { Heart, RefreshCw, Thermometer, Moon, Activity, Wifi, WifiOff, Watch, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { formatLocalDate } from '../lib/screeningEngine';
import { Card, FieldLabel, GhostButton, Notice, PageIntro, PrimaryButton, SectionHeader, inputClass } from './ui';

interface WearableSyncProps {
  user: UserProfile;
  wearableLogs: WearableDataPoint[];
  onUpdateUser: (user: UserProfile) => void;
  onUpdateWearableLogs: (logs: WearableDataPoint[]) => void;
}

export const WearableSyncView: React.FC<WearableSyncProps> = ({
  user,
  wearableLogs,
  onUpdateUser,
  onUpdateWearableLogs,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [baselineHRInput, setBaselineHRInput] = useState(user.baselineHR);
  const [baselineHRVInput, setBaselineHRVInput] = useState(user.baselineHRV);
  const [baselineTempInput, setBaselineTempInput] = useState(user.baselineTemp);

  useEffect(() => {
    setBaselineHRInput(user.baselineHR);
    setBaselineHRVInput(user.baselineHRV);
    setBaselineTempInput(user.baselineTemp);
  }, [user.baselineHR, user.baselineHRV, user.baselineTemp]);

  const today = formatLocalDate(new Date());
  const latest = wearableLogs.find((w) => w.date === today) || wearableLogs[0];

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 3500);
  };

  const handleToggleConnection = () => {
    onUpdateUser({ ...user, isWearableConnected: !user.isWearableConnected });
  };

  const handleDeviceChange = (device: string) => {
    onUpdateUser({
      ...user,
      wearableDevice: device,
      isWearableConnected: device !== 'None',
    });
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      flash('⚡ Data fisiologis PPG berhasil disinkronkan secara real-time!');
    }, 1000);
  };

  const patchToday = (patch: Partial<WearableDataPoint>) => {
    const hasToday = wearableLogs.some((log) => log.date === today);
    const updated = hasToday
      ? wearableLogs.map((log) => (log.date === today ? { ...log, ...patch } : log))
      : [
          {
            date: today,
            restingHR: user.baselineHR,
            avgHR: user.baselineHR + 14,
            hrv: user.baselineHRV,
            skinTempDelta: 0,
            sleepDuration: 7,
            sleepScore: 80,
            steps: 6000,
            dataQuality: 'high' as const,
            ...patch,
          },
          ...wearableLogs,
        ];
    onUpdateWearableLogs(updated);
  };

  const handleSimulateHRSpike = () => {
    patchToday({
      restingHR: user.baselineHR + 14,
      hrv: Math.max(25, user.baselineHRV - 20),
      skinTempDelta: 0.4,
      dataQuality: 'high',
    });
    flash('🚨 Simulasi Terpicu: Lonjakan Resting HR (+14 bpm) & Penurunan HRV (-20 ms).');
  };

  const handleSimulateMissingData = () => {
    patchToday({ dataQuality: 'missing' });
    flash('⚠️ Simulasi: Data sensor hari ini ditandai tidak lengkap.');
  };

  const handleSaveBaselines = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      baselineHR: baselineHRInput,
      baselineHRV: baselineHRVInput,
      baselineTemp: baselineTempInput,
    });
    flash('✅ Baseline norma pribadi berhasil diperbarui!');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Sensor Fisiologis PPG</span>
            <h2 className="text-lg font-black mt-0.5">Koneksi Wearable & Baseline</h2>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing || !user.isWearableConnected}
            className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md grid place-items-center cursor-pointer hover:bg-white/30 transition-all active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 text-white ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Connection & Device Selector Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Watch className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Status Perangkat Wearable
            </h3>
          </div>
          <button
            type="button"
            onClick={handleToggleConnection}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              user.isWearableConnected
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
            }`}
          >
            {user.isWearableConnected ? 'Terhubung' : 'Terputus (Mode Manual)'}
          </button>
        </div>

        <div>
          <FieldLabel>Model Smartwatch / Ring Sensor</FieldLabel>
          <select
            value={user.wearableDevice}
            onChange={(e) => handleDeviceChange(e.target.value)}
            className={`${inputClass} text-xs font-semibold`}
          >
            <option value="Apple Watch Series 9">Apple Watch Series 9</option>
            <option value="Samsung Galaxy Watch 6">Samsung Galaxy Watch 6</option>
            <option value="Garmin Venu 3">Garmin Venu 3</option>
            <option value="Fitbit Charge 6">Fitbit Charge 6</option>
            <option value="Oura Ring Gen 3">Oura Ring Gen 3</option>
            <option value="WHOOP 4.0">WHOOP 4.0</option>
            <option value="None">Tidak Memakai (Input Manual)</option>
          </select>
        </div>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Uji Simulasi Skenario Fisiologi:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSimulateHRSpike}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900 cursor-pointer active:scale-95 transition-all text-center"
            >
              🔥 Lonjakan HR (+14 bpm)
            </button>
            <button
              type="button"
              onClick={handleSimulateMissingData}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900 cursor-pointer active:scale-95 transition-all text-center"
            >
              ⚠️ Data Hilang / Partial
            </button>
          </div>
        </div>
      </div>

      {/* Baseline Config Form */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Atur Baseline Normal Pribadi
        </h3>
        <form onSubmit={handleSaveBaselines} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel>Resting HR</FieldLabel>
              <input
                type="number"
                value={baselineHRInput}
                onChange={(e) => setBaselineHRInput(Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-[9px] text-stone-400 block mt-0.5">bpm</span>
            </div>
            <div>
              <FieldLabel>Baseline HRV</FieldLabel>
              <input
                type="number"
                value={baselineHRVInput}
                onChange={(e) => setBaselineHRVInput(Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-[9px] text-stone-400 block mt-0.5">ms</span>
            </div>
            <div>
              <FieldLabel>Suhu Kulit</FieldLabel>
              <input
                type="number"
                step="0.1"
                value={baselineTempInput}
                onChange={(e) => setBaselineTempInput(Number(e.target.value))}
                className={inputClass}
              />
              <span className="text-[9px] text-stone-400 block mt-0.5">°C</span>
            </div>
          </div>
          <PrimaryButton type="submit" className="w-full py-2.5 text-xs font-bold uppercase">
            Simpan Norma Baseline
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};
