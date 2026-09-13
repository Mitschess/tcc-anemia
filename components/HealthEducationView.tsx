'use client';

import React, { useState } from 'react';
import { UserProfile, RiskAnalysisResult } from '../types/anemia';
import { ChevronDown } from 'lucide-react';
import { Card, GhostButton, Notice, PageIntro } from './ui';

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
      title: 'Memahami anemia dan hemoglobin',
      category: 'Dasar',
      content: `Anemia terjadi ketika kadar hemoglobin (Hb) berada di bawah batas normal. Hemoglobin membawa oksigen dari paru-paru ke jaringan.

Kadar Hb menurut WHO: wanita dewasa 12.0–15.5 g/dL, pria dewasa 13.5–17.5 g/dL.

Jika Hb turun, gejala yang sering muncul adalah kelelahan, pusing, jantung berdebar, dan napas pendek.`,
    },
    {
      id: 'menstruation-bloodloss',
      title: 'Menstruasi berat dan cadangan zat besi',
      category: 'Siklus',
      content: `Kehilangan darah menstruasi rutin dapat menguras ferritin. Perdarahan berat (ganti pembalut kurang dari 2 jam, gumpalan besar, atau durasi lebih dari 7 hari) berisiko kehilangan volume darah yang signifikan setiap siklus.

Tanpa asupan zat besi yang memadai, cadangan tubuh menurun secara bertahap.`,
    },
    {
      id: 'wearable-physiology',
      title: 'Mengapa Resting HR dan HRV berubah',
      category: 'Wearable',
      content: `Wearable tidak mengukur hemoglobin. Yang terukur adalah respons tubuh.

Resting HR naik: jantung memompa lebih cepat untuk menjaga distribusi oksigen saat kapasitas pembawa oksigen menurun.

HRV turun: beban fisiologis dan pemulihan yang kurang, termasuk saat perdarahan atau tidur buruk.`,
    },
    {
      id: 'medical-testing',
      title: 'Pemeriksaan laboratorium yang relevan',
      category: 'Medis',
      content: `AnemiaSense hanya skrining. Jika skor tinggi, pemeriksaan yang biasa dipertimbangkan:

• Darah lengkap (CBC): Hb, hematokrit, sel darah.
• Ferritin serum: cadangan zat besi.
• Serum iron dan TIBC: kapasitas pengikatan zat besi.

Keputusan pemeriksaan ada pada tenaga kesehatan.`,
    },
  ];

  const faqs = [
    {
      q: 'Apakah ini mendiagnosis anemia?',
      a: 'Tidak. Diagnosis hanya melalui pemeriksaan laboratorium dan evaluasi tenaga medis.',
    },
    {
      q: 'Mengapa Resting HR naik saat haid?',
      a: 'Perubahan hormon dan kehilangan volume darah bisa menaikkan detak istirahat. Lonjakan jauh di atas baseline disertai kelelahan berat perlu diperhatikan.',
    },
    {
      q: 'Makanan apa yang mengandung zat besi?',
      a: 'Heme: daging merah, hati, ikan, telur. Non-heme: bayam, kacang-kacangan, tahu, tempe. Vitamin C membantu penyerapan; teh/kopi dekat waktu makan dapat menghambatnya.',
    },
  ];

  const currentArt = articles.find((a) => a.id === activeArticle) || articles[0];

  return (
    <div className="space-y-6">
      <PageIntro
        title="Edukasi"
        description="Materi singkat soal anemia, haid, wearable, dan pemeriksaan lab."
      />

      <Notice>
        {riskResult.score >= 61
          ? `${user.name}, skor Anda saat ini tinggi. Baca panduan laboratorium dan pertimbangkan konsultasi medis.`
          : `${user.name}, skor Anda relatif stabil. Tetap catat siklus dan jaga asupan zat besi.`}
      </Notice>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-1.5">
          {articles.map((art) => (
            <button
              key={art.id}
              type="button"
              onClick={() => setActiveArticle(art.id)}
              className={`w-full p-3.5 rounded-xl border text-left cursor-pointer ${
                activeArticle === art.id
                  ? 'border-stone-900 dark:border-stone-200 bg-[var(--surface)]'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600'
              }`}
            >
              <span className="text-[11px] uppercase tracking-wide text-stone-400">{art.category}</span>
              <h3 className="text-sm font-medium mt-0.5 text-stone-900 dark:text-stone-100">{art.title}</h3>
            </button>
          ))}
          <GhostButton onClick={() => setActiveArticle('medical-testing')} className="w-full mt-2">
            Buka panduan lab
          </GhostButton>
        </div>

        <Card className="lg:col-span-8">
          <p className="text-[11px] uppercase tracking-wide text-stone-400">{currentArt.category}</p>
          <h2 className="text-lg font-semibold mt-1 mb-4">{currentArt.title}</h2>
          <div className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {currentArt.content}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold mb-3">Pertanyaan umum</h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-3.5 text-left text-sm font-medium flex items-center justify-between cursor-pointer"
              >
                {faq.q}
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="px-3.5 pb-3.5 text-sm text-stone-500 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
