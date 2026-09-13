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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold">Profil awal</h2>
          <p className="text-sm text-stone-500 mt-1">
            Data ini dipakai untuk baseline siklus dan wearable. Tidak untuk diagnosis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Nama</FieldLabel>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Usia</FieldLabel>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Panjang siklus (hari)</FieldLabel>
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
              <FieldLabel>Durasi haid (hari)</FieldLabel>
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
            <FieldLabel>Wearable</FieldLabel>
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
              <option value="Apple Watch Series 9">Apple Watch</option>
              <option value="Samsung Galaxy Watch 6">Samsung Galaxy Watch</option>
              <option value="Garmin Venu 3">Garmin</option>
              <option value="Fitbit Charge 6">Fitbit</option>
              <option value="Oura Ring Gen 3">Oura Ring</option>
              <option value="WHOOP 4.0">WHOOP</option>
              <option value="None">Tidak memakai wearable</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Baseline HR (bpm)</FieldLabel>
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

          <PrimaryButton type="submit" className="w-full">
            Lanjut ke aplikasi
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};
