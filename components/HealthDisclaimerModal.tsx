'use client';

import React from 'react';
import { GhostButton, PrimaryButton } from './ui';

interface DisclaimerProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
  isMandatory?: boolean;
}

export const HealthDisclaimerModal: React.FC<DisclaimerProps> = ({
  isOpen,
  onAccept,
  onClose,
  isMandatory = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50">
      <div className="w-full max-w-lg bg-[var(--surface)] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold">Penafian medis</h2>
          <p className="text-sm text-stone-500 mt-1">AnemiaSense adalah skrining risiko, bukan diagnosis.</p>
        </div>

        <div className="p-6 space-y-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            Wearable mengukur sinyal fisiologis seperti Resting HR dan HRV, bukan kadar hemoglobin darah.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Tidak menggantikan pemeriksaan laboratorium.</li>
            <li>Tidak memberikan resep obat atau dosis suplemen.</li>
            <li>Skor tinggi berarti perlu pertimbangan konsultasi medis, bukan kepastian anemia.</li>
          </ul>
        </div>

        <div className="px-6 pb-6 flex items-center justify-end gap-2">
          {!isMandatory && onClose && (
            <GhostButton onClick={onClose}>Tutup</GhostButton>
          )}
          <PrimaryButton onClick={onAccept}>Saya mengerti</PrimaryButton>
        </div>
      </div>
    </div>
  );
};
