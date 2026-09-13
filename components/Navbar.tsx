'use client';

import React from 'react';
import { UserProfile } from '../types/anemia';
import { Activity, Calendar, TrendingUp, BookOpen, ShieldCheck, Watch, MessageCircle, RotateCcw } from 'lucide-react';

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
    { id: 'dashboard', label: 'Ringkasan', icon: Activity },
    { id: 'menstrual', label: 'Siklus', icon: Calendar },
    { id: 'wearable', label: 'Wearable', icon: Watch },
    { id: 'history', label: 'Tren', icon: TrendingUp },
    { id: 'education', label: 'Edukasi', icon: BookOpen },
    { id: 'privacy', label: 'Privasi', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 dark:border-stone-800 bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[3.75rem] gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <img
              src="/images.webp"
              alt="AnemiaSense Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-left">
              <span className="block text-[15px] font-semibold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
                AnemiaSense
              </span>
              <span className="hidden sm:block text-[11px] text-stone-500 mt-0.5">
                Skrining risiko, bukan diagnosis
              </span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-medium'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[12px] text-stone-500">
              <span
                className={`w-1.5 h-1.5 rounded-full ${user.isWearableConnected ? 'bg-emerald-600' : 'bg-amber-500'}`}
              />
              {user.isWearableConnected ? user.wearableDevice : 'Wearable terputus'}
            </span>
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Asisten</span>
            </button>
            <button
              type="button"
              onClick={onResetData}
              title="Reset data sampel"
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-stone-100 dark:border-stone-800 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-medium'
                    : 'text-stone-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenDisclaimer}
        className="w-full text-left border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/50 px-4 py-1.5 text-[11px] text-stone-500 hover:text-stone-700 cursor-pointer"
      >
        <span className="max-w-6xl mx-auto block">
          Hasil aplikasi adalah skrining awal risiko anemia — bukan diagnosis medis.
        </span>
      </button>
    </header>
  );
};
