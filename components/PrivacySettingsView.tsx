'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint, RiskAnalysisResult } from '../types/anemia';
import { ShieldCheck, Download, Printer, RotateCcw, User, Bell, Lock, CheckCircle2 } from 'lucide-react';
import { PrimaryButton, GhostButton, inputClass } from './ui';

interface PrivacyProps {
  user: UserProfile;
  menstrualLogs: MenstrualLog[];
  wearableLogs: WearableDataPoint[];
  riskResult: RiskAnalysisResult;
  onUpdateUser: (user: UserProfile) => void;
  onResetData: () => void;
}

export const PrivacySettingsView: React.FC<PrivacyProps> = ({
  user,
  menstrualLogs,
  wearableLogs,
  riskResult,
  onUpdateUser,
  onResetData,
}) => {
  const [msg, setMsg] = useState<string | null>(null);

  const handleExportData = () => {
    const report = {
      exportDate: new Date().toISOString(),
      appName: 'AnemiaSense',
      disclaimer: 'Skrining risiko, bukan diagnosis.',
      userProfile: {
        name: user.name,
        age: user.age,
        avgCycleLength: user.avgCycleLength,
        wearableDevice: user.wearableDevice,
        baselineHR: user.baselineHR,
        baselineHRV: user.baselineHRV,
      },
      currentScreeningResult: {
        score: riskResult.score,
        category: riskResult.category,
        contributingFactors: riskResult.contributingFactors,
        recommendations: riskResult.recommendations,
      },
      menstrualLogs,
      wearableLogs,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnemiaSense_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Laporan rekam medis JSON berhasil diunduh!');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-stone-800 to-stone-900 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Pengaturan & Privasi</span>
            <h2 className="text-lg font-black mt-0.5">Profil Pengguna & Keamanan</h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md grid place-items-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Ringkasan Identitas Klinis
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
            <span className="text-[10px] text-stone-400 block">Nama / Inisial</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{user.name}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
            <span className="text-[10px] text-stone-400 block">Usia & Kategori</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{user.age} thn (Dewasa)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
            <span className="text-[10px] text-stone-400 block">Baseline Hb Lab</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{user.baselineHbLab || 12.0} g/dL</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
            <span className="text-[10px] text-stone-400 block">Suplemen Zat Besi (TTD)</span>
            <span className="font-bold text-stone-900 dark:text-stone-100 uppercase">{user.ironSupplement || 'Tidak'}</span>
          </div>
        </div>
      </div>

      {/* Permission Toggles Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Izin Keamanan & Notifikasi Nakes
        </h3>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">Sync Wearable Automatic</span>
              <span className="block text-[10px] text-stone-400">Izinkan olah data HR/HRV harian</span>
            </div>
            <input
              type="checkbox"
              checked={user.wearableSyncAllowed !== false && user.isWearableConnected}
              onChange={(e) =>
                onUpdateUser({
                  ...user,
                  wearableSyncAllowed: e.target.checked,
                  isWearableConnected: e.target.checked && user.wearableDevice !== 'None',
                })
              }
              className="w-4 h-4 accent-rose-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">Notifikasi Otomatis ke Nakes</span>
              <span className="block text-[10px] text-stone-400">Kirim alert saat risiko anemia ≥ 61</span>
            </div>
            <input
              type="checkbox"
              checked={user.nakesNotificationEnabled !== false}
              onChange={(e) => onUpdateUser({ ...user, nakesNotificationEnabled: e.target.checked })}
              className="w-4 h-4 accent-rose-600"
            />
          </label>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-2">
          Ekspor & Manajemen Data
        </h3>

        <PrimaryButton onClick={handleExportData} className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Unduh Laporan JSON Dokter
        </PrimaryButton>

        <button
          onClick={onResetData}
          className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset Semua Data ke Sampel
        </button>
      </div>
    </div>
  );
};
