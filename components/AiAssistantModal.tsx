'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile, RiskAnalysisResult, WearableDataPoint } from '../types/anemia';
import { Send, X } from 'lucide-react';
import { inputClass } from './ui';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  riskResult: RiskAnalysisResult;
  latestWearable: WearableDataPoint | undefined;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

function greeting(user: UserProfile, riskResult: RiskAnalysisResult, latestWearable?: WearableDataPoint) {
  const hr = latestWearable ? ` Resting HR ${latestWearable.restingHR} bpm, HRV ${latestWearable.hrv} ms.` : '';
  return `Halo ${user.name}. Skor skrining Anda ${riskResult.score}/100 (${riskResult.category}).${hr} Saya bisa menjelaskan skor, nutrisi zat besi, atau kapan perlu ke lab — ini edukasi, bukan diagnosis.`;
}

export const AiAssistantModal: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  user,
  riskResult,
  latestWearable,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: 'ai',
          text: greeting(user, riskResult, latestWearable),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, user, riskResult, latestWearable]);

  if (!isOpen) return null;

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: textToSend,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const q = textToSend.toLowerCase();
      let reply =
        'Tetap catat siklus, jaga hidrasi, tidur 7–8 jam, dan asupan zat besi. AnemiaSense memantau pola, bukan mengganti dokter.';

      if (q.includes('mengapa') || q.includes('kenapa') || q.includes('skor')) {
        reply = `Skor ${riskResult.score}/100 (${riskResult.category}) memakai aliran haid, gejala, dan — jika wearable terhubung — Resting HR${latestWearable ? ` ${latestWearable.restingHR} bpm (baseline ${user.baselineHR})` : ''} serta HRV${latestWearable ? ` ${latestWearable.hrv} ms (baseline ${user.baselineHRV})` : ''}. Lonjakan HR atau penurunan HRV saat perdarahan berat menaikkan skor.`;
      } else if (q.includes('makanan') || q.includes('nutrisi') || q.includes('zat besi')) {
        reply =
          'Zat besi heme: daging merah, hati, ikan. Non-heme: bayam, kacang, tahu, tempe. Padukan dengan vitamin C. Hindari teh/kopi dekat waktu makan.';
      } else if (q.includes('lab') || q.includes('dokter') || q.includes('periksa')) {
        reply =
          'Jika skor tinggi atau gejala menetap (sesak, palpitasi, pucat), pertimbangkan CBC (Hb) dan ferritin bersama tenaga kesehatan.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const samplePrompts = [
    'Mengapa skor saya seperti ini?',
    'Makanan untuk zat besi?',
    'Kapan perlu tes lab?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50">
      <div className="w-full max-w-lg bg-[var(--surface)] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col h-[min(80vh,640px)]">
        <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Asisten</h3>
            <p className="text-[12px] text-stone-500">Edukasi skrining, bukan pengganti dokter</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#9f2d3a] text-white rounded-br-md'
                    : 'bg-stone-100 dark:bg-stone-800 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`block text-[10px] mt-1 ${m.sender === 'user' ? 'text-white/70' : 'text-stone-400'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
          {isTyping && <p className="text-[12px] text-stone-400">Menulis jawaban…</p>}
        </div>

        <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 flex overflow-x-auto gap-1.5 scrollbar-none">
          {samplePrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 text-[12px] whitespace-nowrap cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tulis pertanyaan…"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="p-2.5 rounded-lg bg-[#9f2d3a] text-white cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
