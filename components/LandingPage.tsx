'use client';

import React from 'react';
import {
  Heart,
  Activity,
  Shield,
  Calendar,
  Watch,
  ChevronRight,
  Droplets,
  Stethoscope,
  Sparkles,
  Brain,
  LineChart,
  ArrowRight,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[var(--background)] text-stone-900 dark:text-stone-100 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-stone-200/60 dark:border-stone-800/60 bg-[var(--surface)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <img src="/images.webp" alt="AnemiaSense" className="w-8 h-8 rounded-xl object-cover shadow-sm" />
            <span className="text-[15px] font-bold tracking-tight">AnemiaSense</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
          >
            Mulai Sekarang
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative py-20 sm:py-28 px-5 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-200/25 dark:bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-rose-700 dark:text-rose-300">
              <Sparkles className="w-3.5 h-3.5" />
              Skrining Risiko Anemia Berbasis AI & Wearable
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.1] tracking-tight">
              Pantau Risiko{' '}
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                Anemia
              </span>{' '}
              Secara Personal
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-lg">
              Kombinasi cerdas data siklus menstruasi, sensor fisiologis wearable (PPG/HR/HRV), dan profil nutrisi untuk skrining awal risiko anemia defisiensi besi — langsung dari pergelangan tangan Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 shadow-xl shadow-rose-500/25 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                Mulai Skrining Gratis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-all cursor-pointer"
              >
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Data privat & terenkripsi
              </span>
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                Terintegrasi Nakes
              </span>
            </div>
          </div>

          {/* Right: Animated Device Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone-like frame */}
              <div className="w-[300px] sm:w-[340px] rounded-[2.5rem] border-2 border-stone-200 dark:border-stone-700 bg-gradient-to-b from-white to-rose-50/50 dark:from-stone-900 dark:to-stone-900 shadow-2xl overflow-hidden p-6">
                {/* Mock status bar */}
                <div className="flex items-center justify-between mb-6 text-[10px] text-stone-400 px-1">
                  <span>14:12</span>
                  <div className="flex items-center gap-1">
                    <span>📶</span>
                    <span>🔋 85%</span>
                  </div>
                </div>

                {/* Cycle Ring Widget */}
                <div className="flex flex-col items-center">
                  <div className="relative w-44 h-44 mb-4">
                    {/* Outer animated ring */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                      <circle cx="90" cy="90" r="78" fill="none" stroke="#fecdd3" strokeWidth="8" opacity="0.4" />
                      <circle
                        cx="90"
                        cy="90"
                        r="78"
                        fill="none"
                        stroke="url(#grad1)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 78}
                        strokeDashoffset={2 * Math.PI * 78 * 0.25}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#e11d48" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-widest">Folikular</span>
                      <span className="text-xs text-stone-500 mt-0.5">Haid dalam</span>
                      <span className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-0.5">18</span>
                      <span className="text-xs text-stone-400">hari</span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center gap-6 text-[11px] text-stone-500 mb-5">
                    <span>👟 <strong className="text-stone-700 dark:text-stone-200">6,420</strong> langkah</span>
                    <span>❤️ <strong className="text-stone-700 dark:text-stone-200">68</strong> bpm</span>
                  </div>

                  {/* Risk card preview */}
                  <div className="w-full rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Risiko Anemia: Rendah</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">12/100</span>
                    </div>
                    <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/60 mt-1.5 leading-relaxed">
                      Kondisi fisiologis Anda dalam rentang normal hari ini.
                    </p>
                  </div>

                  {/* Daily insights preview */}
                  <div className="w-full mt-3 flex gap-2 overflow-hidden">
                    <div className="flex-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                      <p className="text-[9px] text-stone-400 mb-1">Siklus</p>
                      <p className="text-lg font-black text-rose-600">10</p>
                      <p className="text-[9px] text-stone-400">Hari ke-</p>
                    </div>
                    <div className="flex-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                      <p className="text-[9px] text-stone-400 mb-1">HRV</p>
                      <p className="text-lg font-black text-blue-600">55</p>
                      <p className="text-[9px] text-stone-400">ms</p>
                    </div>
                    <div className="flex-1 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                      <p className="text-[9px] text-stone-400 mb-1">Tidur</p>
                      <p className="text-lg font-black text-violet-600">7.2</p>
                      <p className="text-[9px] text-stone-400">jam</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -left-8 top-20 animate-bounce-slow">
                <div className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-700 text-[11px] flex items-center gap-2">
                  <Watch className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Wearable Sync</span>
                </div>
              </div>
              <div className="absolute -right-6 bottom-24 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <div className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-700 text-[11px] flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">Analisis ML</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-5 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent dark:via-rose-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2">Fitur Utama</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Semua yang Anda Butuhkan untuk<br />
              <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">Pemantauan Proaktif</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Calendar,
                color: 'rose',
                title: 'Tracking Siklus Menstruasi',
                desc: 'Kalender & log haid, intensitas aliran, estimasi volume PBAC, prediksi siklus berikutnya.',
              },
              {
                icon: Activity,
                color: 'blue',
                title: 'Sensor PPG & Wearable',
                desc: 'Integrasi real-time dengan Resting HR, HRV, suhu kulit, dan kualitas tidur dari smartwatch Anda.',
              },
              {
                icon: Brain,
                color: 'purple',
                title: 'Analisis ML Risiko',
                desc: 'Algoritma multi-faktor yang menggabungkan data fisiologis, menstruasi, dan profil nutrisi menjadi skor risiko 0–100.',
              },
              {
                icon: Droplets,
                color: 'red',
                title: 'Gejala Spesifik Anemia',
                desc: 'Lacak gejala spesifik: lelah berlebihan, pusing, pucat, jantung berdebar, kaki/tangan dingin.',
              },
              {
                icon: Stethoscope,
                color: 'emerald',
                title: 'Dashboard Nakes',
                desc: 'Notifikasi otomatis ke tenaga kesehatan hanya pada kasus risiko tinggi, atas persetujuan Anda.',
              },
              {
                icon: LineChart,
                color: 'amber',
                title: 'Tren & Riwayat',
                desc: 'Visualisasi tren HR, HRV, dan intensitas perdarahan dari hari ke hari untuk deteksi dini.',
              },
            ].map((feature, i) => {
              const colorMap: Record<string, string> = {
                rose: 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 border-rose-200/60 dark:border-rose-900/40',
                blue: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 border-blue-200/60 dark:border-blue-900/40',
                purple: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 border-purple-200/60 dark:border-purple-900/40',
                red: 'bg-red-100 dark:bg-red-950/40 text-red-600 border-red-200/60 dark:border-red-900/40',
                emerald: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200/60 dark:border-emerald-900/40',
                amber: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 border-amber-200/60 dark:border-amber-900/40',
              };
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-[var(--surface)] hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${colorMap[feature.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2">Alur Kerja</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Cara Kerja <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">AnemiaSense</span>
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { step: '1', title: 'Registrasi & Profil Baseline', desc: 'Isi data usia, riwayat anemia, pola makan, konsumsi suplemen, dan kalibrasi wearable Anda.', icon: Shield },
              { step: '2', title: 'Tracking Harian', desc: 'Catat siklus menstruasi, intensitas aliran (PBAC), dan gejala harian dari aplikasi.', icon: Calendar },
              { step: '3', title: 'Sync Sensor PPG / Wearable', desc: 'Data Resting HR, HRV, suhu kulit, dan kualitas tidur otomatis tersinkronisasi.', icon: Watch },
              { step: '4', title: 'Analisis ML & Klasifikasi', desc: 'Algoritma multi-faktor menghitung skor risiko anemia 0–100 dari semua data Anda.', icon: Brain },
              { step: '5', title: 'Hasil & Rekomendasi', desc: 'Dapatkan skor risiko, penjelasan faktor, dan tindakan klinis yang bisa dilakukan segera.', icon: Heart },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 text-white text-sm font-bold grid place-items-center shadow-lg shadow-rose-500/20 shrink-0">
                      {item.step}
                    </div>
                    {i < 4 && <div className="w-px flex-1 bg-gradient-to-b from-rose-300 to-transparent dark:from-rose-800 my-1" />}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-rose-600" />
                      <h3 className="text-sm font-bold">{item.title}</h3>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 p-10 sm:p-14 text-center text-white shadow-2xl shadow-rose-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <Heart className="w-10 h-10 mx-auto mb-4 text-rose-200" />
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                Mulai Pemantauan Risiko Anemia Anda
              </h2>
              <p className="text-sm text-rose-100 leading-relaxed max-w-lg mx-auto mb-8">
                Gratis, privat, dan berbasis bukti klinis. Daftarkan profil baseline Anda sekarang dan dapatkan skrining awal risiko anemia dalam hitungan menit.
              </p>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-white text-rose-700 hover:bg-rose-50 shadow-xl transition-all cursor-pointer"
              >
                Daftar & Mulai Skrining
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/60 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <img src="/images.webp" alt="AnemiaSense" className="w-5 h-5 rounded-lg object-cover" />
            <span>AnemiaSense © 2024 — Skrining awal, bukan alat diagnosis medis.</span>
          </div>
          <div className="flex gap-4">
            <span>Privasi</span>
            <span>Syarat & Ketentuan</span>
            <span>Penafian Medis</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
