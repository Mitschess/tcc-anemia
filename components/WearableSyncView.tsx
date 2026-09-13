'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, WearableDataPoint } from '../types/anemia';
import { Heart, RefreshCw, Thermometer, Moon, Activity, Wifi, WifiOff } from 'lucide-react';
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
      flash('Data fisiologis berhasil disinkronkan (simulasi).');
    }, 900);
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
    flash('Simulasi: resting HR +14 bpm, HRV −20 ms.');
  };

  const handleSimulateMissingData = () => {
    patchToday({ dataQuality: 'missing' });
    flash('Simulasi data hari ini ditandai hilang.');
  };

  const handleSaveBaselines = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      baselineHR: baselineHRInput,
      baselineHRV: baselineHRVInput,
      baselineTemp: baselineTempInput,
    });
    flash('Baseline pribadi diperbarui.');
  };

  return (
    <div className="space-y-6">
      <PageIntro
        title="Perangkat wearable"
        description="Hubungkan perangkat dan atur baseline Resting HR, HRV, serta suhu untuk skrining yang lebih akurat."
        action={
          <PrimaryButton onClick={handleSyncNow} disabled={isSyncing || !user.isWearableConnected}>
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Menyinkronkan…' : 'Sinkronkan'}
          </PrimaryButton>
        }
      />

      {msg && <Notice tone="ok">{msg}</Notice>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 space-y-5">
          <Card>
            <SectionHeader
              title="Koneksi perangkat"
              action={
                <GhostButton onClick={handleToggleConnection} className="text-xs py-1.5">
                  {user.isWearableConnected ? 'Putuskan' : 'Hubungkan'}
                </GhostButton>
              }
            />
            <FieldLabel>Merek perangkat</FieldLabel>
            <select
              value={user.wearableDevice}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className={`${inputClass} mb-4`}
            >
              <option value="Apple Watch Series 9">Apple Watch</option>
              <option value="Samsung Galaxy Watch 6">Samsung Galaxy Watch</option>
              <option value="Garmin Venu 3">Garmin</option>
              <option value="Fitbit Charge 6">Fitbit</option>
              <option value="Oura Ring Gen 3">Oura Ring</option>
              <option value="WHOOP 4.0">WHOOP</option>
              <option value="None">Tidak memakai wearable</option>
            </select>

            <div className="flex items-center justify-between rounded-xl border border-stone-200 dark:border-stone-800 px-3.5 py-3 text-sm">
              <div className="flex items-center gap-2">
                {user.isWearableConnected ? (
                  <Wifi className="w-4 h-4 text-emerald-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-amber-600" />
                )}
                {user.isWearableConnected ? `Terhubung ke ${user.wearableDevice}` : 'Mode manual'}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
              <p className="text-[12px] text-stone-400 mb-2">Uji skenario</p>
              <div className="grid grid-cols-2 gap-2">
                <GhostButton type="button" onClick={handleSimulateHRSpike} className="text-xs">
                  Simulasi lonjakan HR
                </GhostButton>
                <GhostButton type="button" onClick={handleSimulateMissingData} className="text-xs">
                  Simulasi data hilang
                </GhostButton>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Baseline pribadi" hint="Nilai saat tubuh istirahat dan cukup pulih" />
            <form onSubmit={handleSaveBaselines} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <FieldLabel>HR (bpm)</FieldLabel>
                  <input
                    type="number"
                    min={40}
                    max={120}
                    value={baselineHRInput}
                    onChange={(e) => setBaselineHRInput(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel>HRV (ms)</FieldLabel>
                  <input
                    type="number"
                    min={10}
                    max={150}
                    value={baselineHRVInput}
                    onChange={(e) => setBaselineHRVInput(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel>Suhu (°C)</FieldLabel>
                  <input
                    type="number"
                    step="0.1"
                    min={35}
                    max={38}
                    value={baselineTempInput}
                    onChange={(e) => setBaselineTempInput(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
              <PrimaryButton type="submit" className="w-full">
                Simpan baseline
              </PrimaryButton>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-5">
          {(latest?.dataQuality === 'missing' || !user.isWearableConnected) && (
            <Notice tone="warn">
              Data HR hari ini belum lengkap. Hubungkan wearable agar skor memakai Resting HR dan HRV. Data yang hilang tidak dianggap abnormal.
            </Notice>
          )}

          <Card>
            <SectionHeader title="Pembacaan hari ini" hint={latest?.date ?? '—'} />
            {latest ? (
              <div className="space-y-2.5">
                <Reading icon={<Heart className="w-4 h-4" />} title="Resting heart rate" value={`${latest.restingHR} bpm`} sub={`Baseline ${user.baselineHR}`} />
                <Reading icon={<Activity className="w-4 h-4" />} title="HRV" value={`${latest.hrv} ms`} sub={`Baseline ${user.baselineHRV}`} />
                <Reading
                  icon={<Thermometer className="w-4 h-4" />}
                  title="Suhu kulit"
                  value={`${latest.skinTempDelta >= 0 ? '+' : ''}${latest.skinTempDelta}°C`}
                  sub={`Perkiraan ${(user.baselineTemp + latest.skinTempDelta).toFixed(1)}°C`}
                />
                <Reading icon={<Moon className="w-4 h-4" />} title="Tidur" value={`${latest.sleepDuration} jam`} sub={`Skor ${latest.sleepScore}/100`} />
              </div>
            ) : (
              <p className="text-sm text-stone-500">Belum ada data wearable.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

function Reading({
  icon,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200 dark:border-stone-800 px-3.5 py-3">
      <div className="flex items-center gap-3">
        <span className="text-stone-400">{icon}</span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-[12px] text-stone-500">{sub}</p>
        </div>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
