'use client';

import React, { useState } from 'react';
import { UserProfile, RiskAnalysisResult } from '../types/anemia';
import { BookOpen, ChevronDown, Sparkles, CheckCircle2, Stethoscope, HelpCircle } from 'lucide-react';

interface HealthEducationProps {
  user: UserProfile;
  riskResult: RiskAnalysisResult;
}

export const HealthEducationView: React.FC<HealthEducationProps> = ({ user, riskResult }) => {
  const [activeArticle, setActiveArticle] = useState<string>('anemia-101');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const articles = [
    {
      id: 'anemia-101',
      title: 'Memahami Anemia & Hemoglobin',
      category: 'Dasar Klinis',
      content: `Anemia terjadi ketika kadar hemoglobin (Hb) berada di bawah batas normal. Hemoglobin bertanggung jawab membawa oksigen dari paru-paru ke seluruh sel tubuh.

Kadar Hb Norma WHO:
• Wanita Dewasa: 12.0 – 15.5 g/dL
• Remaja Putri: 12.0 – 14.0 g/dL

Gejala khas anemia yang sering diabaikan meliputi: lelah berlebihan, pusing saat bangkit, kulit/kuku pucat, dan kaki/tangan dingin.`,
    },
    {
      id: 'menstruation-bloodloss',
      title: 'Darah Haid (PBAC) & Zat Besi',
      category: 'Siklus',
      content: `Kehilangan darah menstruasi yang signifikan setiap bulan dapat secara bertahap menguras cadangan zat besi (ferritin) tubuh.

Kriteria Perdarahan Berat (PBAC High):
• Mengganti pembalut penuh dalam < 2 jam
• Adanya gumpalan darah berukuran besar
• Durasi haid > 7 hari berturut-turut`,
    },
    {
      id: 'wearable-physiology',
      title: 'Resting HR & HRV dari Sensor Wearable',
      category: 'Sensor Fisiologi',
      content: `Wearable smart watch mengukur respons kompensasi jaringan tubuh:

1. Lonjakan Resting HR: Saat Hb rendah, jantung berdetak lebih cepat untuk menjaga pasokan oksigen.
2. Penurunan HRV: Mengindikasikan stres fisiologis dan beban pemulihan selular.`,
    },
    {
      id: 'medical-testing',
      title: 'Panduan Pemeriksaan Lab & Nakes',
      category: 'Rekomendasi Lab',
      content: `Skrining AnemiaSense memberikan indikasi awal. Jika skor risiko Anda sedang/tinggi, disarankan konsultasi nakes untuk tes berikut:

• Complete Blood Count (CBC / Darah Lengkap)
• Serum Ferritin (Cadangan Zat Besi)
• Iron Binding Capacity (TIBC)`,
    },
  ];

  const faqs = [
    {
      q: 'Apakah AnemiaSense mendiagnosis secara medis?',
      a: 'Tidak. AnemiaSense adalah alat skrining awal berbasis kecerdasan buatan & wearable. Diagnosis resmi wajib melalui tes darah laboratorium oleh dokter.',
    },
    {
      q: 'Mengapa detak jantung istirahat naik saat haid?',
      a: 'Perubahan hormon dan fluktuasi volume darah saat perdarahan dapat meningkatkan beban kerja jantung sementara.',
    },
    {
      q: 'Makanan apa yang membantu menambah zat besi?',
      a: 'Zat besi Heme (penyerapan tinggi): Daging merah, hati sapi, telur, ikan. Zat besi Non-Heme: Bayam, tempe, tahu. Kombinasikan dengan Vitamin C (jeruk) untuk penyerapan maksimal.',
    },
  ];

  const currentArt = articles.find((a) => a.id === activeArticle) || articles[0];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">Pusat Informasi & Edukasi</span>
            <h2 className="text-lg font-black mt-0.5">Edukasi Anemia & Klinis</h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md grid place-items-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Article Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {articles.map((art) => (
          <button
            key={art.id}
            onClick={() => setActiveArticle(art.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-all ${
              activeArticle === art.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {art.title}
          </button>
        ))}
      </div>

      {/* Active Article Viewer Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-rose-600 dark:text-rose-400 block">
          {currentArt.category}
        </span>
        <h3 className="text-base font-black text-stone-900 dark:text-stone-100">{currentArt.title}</h3>
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line pt-1">
          {currentArt.content}
        </p>
      </div>

      {/* Accordion FAQ Section */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Pertanyaan Sering Diajukan (FAQ)
          </h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-3 text-left text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <p className="px-3 pb-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800/50 pt-2">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
