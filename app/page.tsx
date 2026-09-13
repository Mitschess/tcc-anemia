'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint } from '../types/anemia';
import {
  loadUserProfile,
  saveUserProfile,
  loadMenstrualLogs,
  saveMenstrualLogs,
  loadWearableLogs,
  saveWearableLogs,
  resetAllData,
} from '../lib/storage';
import { calculateRiskScore, calculateCyclePrediction, formatLocalDate } from '../lib/screeningEngine';

import { Navbar } from '../components/Navbar';
import { HealthDisclaimerModal } from '../components/HealthDisclaimerModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { DashboardView } from '../components/DashboardView';
import { MenstrualTrackerView } from '../components/MenstrualTrackerView';
import { WearableSyncView } from '../components/WearableSyncView';
import { HistoryAnalyticsView } from '../components/HistoryAnalyticsView';
import { HealthEducationView } from '../components/HealthEducationView';
import { PrivacySettingsView } from '../components/PrivacySettingsView';
import { AiAssistantModal } from '../components/AiAssistantModal';

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menstrualLogs, setMenstrualLogs] = useState<MenstrualLog[]>([]);
  const [wearableLogs, setWearableLogs] = useState<WearableDataPoint[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  useEffect(() => {
    const loadedUser = loadUserProfile();
    setUser(loadedUser);
    setMenstrualLogs(loadMenstrualLogs());
    setWearableLogs(loadWearableLogs());

    if (!loadedUser.disclaimerAccepted) {
      setIsDisclaimerOpen(true);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--background)] text-stone-500 text-sm">
        Memuat AnemiaSense…
      </div>
    );
  }

  const todayStr = formatLocalDate(new Date());
  const riskResult = calculateRiskScore(user, menstrualLogs, wearableLogs, todayStr);
  const prediction = calculateCyclePrediction(user, menstrualLogs, todayStr);
  const latestWearable = wearableLogs.find((w) => w.date === todayStr) || wearableLogs[0];
  const todayLog = menstrualLogs.find((l) => l.date === todayStr);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
  };

  const handleSaveMenstrualLog = (log: MenstrualLog) => {
    const existingIdx = menstrualLogs.findIndex((l) => l.date === log.date);
    const updated =
      existingIdx >= 0
        ? menstrualLogs.map((l, i) => (i === existingIdx ? log : l))
        : [log, ...menstrualLogs];
    setMenstrualLogs(updated);
    saveMenstrualLogs(updated);
  };

  const handleUpdateWearableLogs = (logs: WearableDataPoint[]) => {
    setWearableLogs(logs);
    saveWearableLogs(logs);
  };

  const handleResetData = () => {
    if (confirm('Reset semua data ke sampel default AnemiaSense?')) {
      const fresh = resetAllData();
      setUser(fresh.user);
      setMenstrualLogs(fresh.menstrualLogs);
      setWearableLogs(fresh.wearableLogs);
      setActiveTab('dashboard');
    }
  };

  const handleAcceptDisclaimer = () => {
    const updated = { ...user, disclaimerAccepted: true };
    setUser(updated);
    saveUserProfile(updated);
    setIsDisclaimerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-stone-900 dark:text-stone-100 font-sans">
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onResetData={handleResetData}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            riskResult={riskResult}
            prediction={prediction}
            latestWearable={latestWearable}
            todayLog={todayLog}
            onOpenLogger={() => setActiveTab('menstrual')}
            onNavigateTab={setActiveTab}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          />
        )}

        {activeTab === 'menstrual' && (
          <MenstrualTrackerView
            user={user}
            logs={menstrualLogs}
            prediction={prediction}
            onSaveLog={handleSaveMenstrualLog}
          />
        )}

        {activeTab === 'wearable' && (
          <WearableSyncView
            user={user}
            wearableLogs={wearableLogs}
            onUpdateUser={handleUpdateUser}
            onUpdateWearableLogs={handleUpdateWearableLogs}
          />
        )}

        {activeTab === 'history' && (
          <HistoryAnalyticsView
            user={user}
            menstrualLogs={menstrualLogs}
            wearableLogs={wearableLogs}
          />
        )}

        {activeTab === 'education' && (
          <HealthEducationView user={user} riskResult={riskResult} />
        )}

        {activeTab === 'privacy' && (
          <PrivacySettingsView
            user={user}
            menstrualLogs={menstrualLogs}
            wearableLogs={wearableLogs}
            riskResult={riskResult}
            onUpdateUser={handleUpdateUser}
            onResetData={handleResetData}
          />
        )}
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800 py-5 text-[12px] text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/images.webp" alt="AnemiaSense" className="w-5 h-5 rounded object-cover shrink-0" />
            <p>AnemiaSense · skrining awal, bukan alat diagnosis.</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setIsDisclaimerOpen(true)} className="hover:text-stone-800 cursor-pointer">
              Penafian medis
            </button>
            <button type="button" onClick={() => setActiveTab('privacy')} className="hover:text-stone-800 cursor-pointer">
              Privasi
            </button>
            <button type="button" onClick={() => setActiveTab('education')} className="hover:text-stone-800 cursor-pointer">
              Edukasi
            </button>
          </div>
        </div>
      </footer>

      <HealthDisclaimerModal
        isOpen={isDisclaimerOpen}
        onAccept={handleAcceptDisclaimer}
        onClose={() => setIsDisclaimerOpen(false)}
        isMandatory={!user.disclaimerAccepted}
      />

      <OnboardingModal
        isOpen={!user.onboardingCompleted}
        user={user}
        onSave={handleUpdateUser}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        user={user}
        riskResult={riskResult}
        latestWearable={latestWearable}
      />
    </div>
  );
}
