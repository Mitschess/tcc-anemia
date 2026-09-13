'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint, RiskAnalysisResult } from '../types/anemia';
import { Card, GhostButton, Notice, PageIntro, PrimaryButton, SectionHeader } from './ui';

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
    a.download = `AnemiaSense_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Laporan JSON diunduh.');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageIntro
        title="Privasi dan data"
        description="Kendalikan izin wearable, unduh ringkasan, atau hapus data lokal di perangkat ini."
      />

      {msg && <Notice tone="ok">{msg}</Notice>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-5">
          <Card>
            <SectionHeader title="Izin" />
            <label className="flex items-center justify-between gap-4 py-3 border-b border-stone-100 dark:border-stone-800 cursor-pointer">
              <span>
                <span className="block text-sm font-medium">Akses data wearable</span>
                <span className="block text-[13px] text-stone-500">Memakai Resting HR dan HRV dalam skor</span>
              </span>
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
                className="w-4 h-4 accent-[#9f2d3a]"
              />
            </label>
            <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
              <span>
                <span className="block text-sm font-medium">Siapkan data untuk dokter</span>
                <span className="block text-[13px] text-stone-500">Mengizinkan ekspor ringkasan skrining</span>
              </span>
              <input
                type="checkbox"
                checked={!!user.dataSharingAllowed}
                onChange={(e) => onUpdateUser({ ...user, dataSharingAllowed: e.target.checked })}
                className="w-4 h-4 accent-[#9f2d3a]"
              />
            </label>
          </Card>

          <Card>
            <SectionHeader title="Hapus data" hint="Data hanya tersimpan di browser ini." />
            <GhostButton onClick={onResetData} className="text-[#9f2d3a] border-rose-200">
              Reset ke data sampel
            </GhostButton>
          </Card>
        </div>

        <Card className="lg:col-span-5">
          <SectionHeader title="Ringkasan untuk konsultasi" />
          <dl className="text-sm space-y-2 mb-4">
            <div className="flex justify-between">
              <dt className="text-stone-500">Nama</dt>
              <dd className="font-medium">{user.name}, {user.age} th</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Skor</dt>
              <dd className="font-medium">{riskResult.score}/100 · {riskResult.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Resting HR</dt>
              <dd className="font-medium">{wearableLogs[0]?.restingHR ?? '—'} bpm</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">HRV</dt>
              <dd className="font-medium">{wearableLogs[0]?.hrv ?? '—'} ms</dd>
            </div>
          </dl>
          <div className="space-y-2">
            <PrimaryButton
              className="w-full"
              onClick={handleExportData}
              disabled={!user.dataSharingAllowed}
              title={!user.dataSharingAllowed ? 'Aktifkan izin berbagi data' : undefined}
            >
              Unduh JSON
            </PrimaryButton>
            <GhostButton className="w-full" onClick={() => window.print()} disabled={!user.dataSharingAllowed}>
              Cetak / PDF
            </GhostButton>
            {!user.dataSharingAllowed && (
              <p className="text-[12px] text-stone-400">Aktifkan izin berbagi data untuk mengekspor.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
