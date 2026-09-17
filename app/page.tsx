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

import { LandingPage } from '../components/LandingPage';
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
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  useEffect(() => {
    const loadedUser = loadUserProfile();
    setUser(loadedUser);
    setMenstrualLogs(loadMenstrualLogs());
    setWearableLogs(loadWearableLogs());

    // If onboarding already completed, skip landing page
    if (loadedUser.onboardingCompleted) {
      setShowLanding(false);
      setShowOnboarding(false);
    }

    if (!loadedUser.disclaimerAccepted) {
      setIsDisclaimerOpen(true);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          <p className="text-xs text-stone-500 font-medium">Memuat AnemiaSense Mobile…</p>
        </div>
      </div>
    );
  }

  // Show landing page before login/onboarding
  if (showLanding && !user.onboardingCompleted) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLanding(false);
          setShowOnboarding(true);
        }}
      />
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
    if (updatedUser.onboardingCompleted) {
      setShowOnboarding(false);
    }
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
    <div className="min-h-screen bg-stone-900/95 flex justify-center text-stone-900 dark:text-stone-100 font-sans">
      {/* MOBILE APPLICATION DEVICE CONTAINER (Max Width Smartphone Frame) */}
      <div className="w-full max-w-md min-h-screen bg-[var(--background)] relative flex flex-col shadow-2xl border-x border-stone-200/50 dark:border-stone-800/50 pb-20">
        
        {/* Mobile Header & Bottom Navigation */}
        <Navbar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          onResetData={handleResetData}
          onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        />

        {/* Mobile Main Views Area */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
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

        <HealthDisclaimerModal
          isOpen={isDisclaimerOpen}
          onAccept={handleAcceptDisclaimer}
          onClose={() => setIsDisclaimerOpen(false)}
          isMandatory={!user.disclaimerAccepted}
        />

        <OnboardingModal
          isOpen={showOnboarding || !user.onboardingCompleted}
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
    </div>
  );
}
