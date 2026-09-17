'use client';

import React from 'react';
import { UserProfile } from '../types/anemia';
import { Activity, Calendar, TrendingUp, BookOpen, ShieldCheck, Watch, Sparkles } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  onResetData: () => void;
  onOpenDisclaimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  onResetData,
  onOpenDisclaimer,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Activity },
    { id: 'menstrual', label: 'Siklus', icon: Calendar },
    { id: 'wearable', label: 'Sensor', icon: Watch },
    { id: 'history', label: 'Tren', icon: TrendingUp },
    { id: 'education', label: 'Edukasi', icon: BookOpen },
    { id: 'privacy', label: 'Profil', icon: ShieldCheck },
  ];

  return (
    <>
      {/* MOBILE TOP BAR HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-rose-100/80 dark:border-stone-800/80 bg-[var(--surface)]/90 backdrop-blur-xl shadow-xs">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: App Brand & Logo */}
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 cursor-pointer shrink-0"
            >
              <div className="relative">
                <img
                  src="/images.webp"
                  alt="AnemiaSense"
                  className="w-8 h-8 rounded-full object-cover border-2 border-rose-500 shadow-sm"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-stone-900 ${
                    user.isWearableConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
                  AnemiaSense
                </span>
                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold tracking-wide uppercase">
                  Mobile Care
                </span>
              </div>
            </button>

            {/* Right Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50">
                {user.isWearableConnected ? '⌚ Wearable Active' : 'Manual Mode'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* FLOATING ACTION BUTTON (FAB) UNTUK ASISTEN AI */}
      <div className="fixed bottom-20 right-4 max-w-md z-40">
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>Tanya AI</span>
        </button>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED BOTTOM FLO-STYLE) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border-t border-rose-100 dark:border-stone-800 shadow-lg px-2 py-1.5">
        <div className="max-w-md mx-auto grid grid-cols-6 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 font-bold scale-105'
                    : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-rose-100/80 dark:bg-rose-950/60 shadow-xs' : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
