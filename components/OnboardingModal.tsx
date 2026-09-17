'use client';

import React, { useState } from 'react';
import { UserProfile } from '../types/anemia';
import { FieldLabel, PrimaryButton, inputClass } from './ui';

interface OnboardingProps {
  isOpen: boolean;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingProps> = ({ isOpen, user, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      onboardingCompleted: true,
      disclaimerAccepted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-[var(--surface)] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8">
        <div className="px-6 pt-6 pb-2 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
              Registrasi Baseline Awal
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-stone-900 dark:text-stone-50">Profil Baseline Anemia & Siklus</h2>
          <p className="text-xs text-stone-500 mt-1">
            Data ini digunakan untuk menghitung norma Hb personal, kalibrasi wearable, dan skrining risiko harian.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Demografi & Tujuan */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">1. Profil & Tujuan Utama</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Nama Lengkap</FieldLabel>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>Usia (Tahun)</FieldLabel>
                <input
                  type="number"
                  min={10}
                  max={90}
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Tujuan Utama Menggunakan Aplikasi</FieldLabel>
              <select
                value={formData.appGoal || 'anemia_monitoring'}
                onChange={(e) => setFormData({ ...formData, appGoal: e.target.value as any })}
                className={inputClass}
              >
                <option value="anemia_monitoring">Pantau Risiko Anemia & Kesehatan Sel Darah (Rekomendasi)</option>
                <option value="cycle_tracking">Lacak Siklus Haid & Masa Subur Sahaja</option>
                <option value="both">Keduanya (Pantau Anemia + Lacak Siklus)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Riwayat Kesehatan & Pola Makan */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">2. Riwayat Kesehatan & Nutrisi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Riwayat Anemia Sebelumnya</FieldLabel>
                <select
                  value={formData.anemiaHistory || 'no'}
                  onChange={(e) => setFormData({ ...formData, anemiaHistory: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="no">Tidak Pernah Didiagnosis</option>
                  <option value="yes">Pernah Didiagnosis Anemia</option>
                  <option value="unsure">Tidak Yakin / Belum Pernah Cek</option>
                </select>
              </div>

              <div>
                <FieldLabel>Pola Makan / Asupan Asam Folat & Besi</FieldLabel>
                <select
                  value={formData.dietPattern || 'omnivore'}
                  onChange={(e) => setFormData({ ...formData, dietPattern: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="omnivore">Seimbang (Sering Makan Daging/Hati/Bayam)</option>
                  <option value="low_red_meat">Jarang Makan Daging Merah / Hati</option>
                  <option value="vegetarian">Vegetarian (Tanpa Daging)</option>
                  <option value="vegan">Vegan Murni</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Konsumsi Tablet Tambah Darah (TTD)</FieldLabel>
                <select
                  value={formData.ironSupplement || 'irregular'}
                  onChange={(e) => setFormData({ ...formData, ironSupplement: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="regular">Rutin Minum Suplemen / TTD</option>
                  <option value="irregular">Kadang-kadang / Tidak Rutin</option>
                  <option value="never">Tidak Pernah Minum Suplemen</option>
                </select>
              </div>

              <div>
                <FieldLabel>Hasil Tes Lab Hb Baseline (g/dL)</FieldLabel>
                <input
                  type="number"
                  step="0.1"
                  min={5}
                  max={20}
                  placeholder="Misal: 12.0 (Opsional)"
                  value={formData.baselineHbLab || ''}
                  onChange={(e) => setFormData({ ...formData, baselineHbLab: e.target.value ? Number(e.target.value) : undefined })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Siklus & Wearable */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">3. Siklus & Kalibrasi Sensor</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <FieldLabel>Keteraturan Siklus</FieldLabel>
                <select
                  value={formData.cycleRegularity || 'regular'}
                  onChange={(e) => setFormData({ ...formData, cycleRegularity: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="regular">Teratur</option>
                  <option value="irregular">Tidak Teratur</option>
                </select>
              </div>
              <div>
                <FieldLabel>Panjang Siklus (Hari)</FieldLabel>
                <input
                  type="number"
                  min={20}
                  max={45}
                  value={formData.avgCycleLength}
                  onChange={(e) => setFormData({ ...formData, avgCycleLength: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>Durasi Haid (Hari)</FieldLabel>
                <input
                  type="number"
                  min={2}
                  max={14}
                  value={formData.periodDuration}
                  onChange={(e) => setFormData({ ...formData, periodDuration: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Perangkat Wearable / Sensor PPG</FieldLabel>
              <select
                value={formData.wearableDevice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wearableDevice: e.target.value,
                    isWearableConnected: e.target.value !== 'None',
                  })
                }
                className={inputClass}
              >
                <option value="Apple Watch Series 9">Apple Watch Series 9</option>
                <option value="Samsung Galaxy Watch 6">Samsung Galaxy Watch 6</option>
                <option value="Garmin Venu 3">Garmin Venu 3</option>
                <option value="Fitbit Charge 6">Fitbit Charge 6</option>
                <option value="Oura Ring Gen 3">Oura Ring Gen 3</option>
                <option value="WHOOP 4.0">WHOOP 4.0</option>
                <option value="None">Tidak memakai wearable (Input manual)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Baseline Resting HR (bpm)</FieldLabel>
                <input
                  type="number"
                  min={40}
                  max={120}
                  value={formData.baselineHR}
                  onChange={(e) => setFormData({ ...formData, baselineHR: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>Baseline HRV (ms)</FieldLabel>
                <input
                  type="number"
                  min={10}
                  max={150}
                  value={formData.baselineHRV}
                  onChange={(e) => setFormData({ ...formData, baselineHRV: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">Notifikasi Otomatis ke Nakes</p>
                <p className="text-[11px] text-stone-500">Hanya dikirim jika terdeteksi kasus risiko tinggi anemia</p>
              </div>
              <input
                type="checkbox"
                checked={formData.nakesNotificationEnabled ?? true}
                onChange={(e) => setFormData({ ...formData, nakesNotificationEnabled: e.target.checked })}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </div>
          </div>

          <PrimaryButton type="submit" className="w-full mt-4">
            Simpan & Mulai Pemantauan Anemia
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

