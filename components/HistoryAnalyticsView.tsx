'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint } from '../types/anemia';
import { parseLocalDate } from '../lib/screeningEngine';
import { TrendingUp, Activity, Calendar, Heart } from 'lucide-react';

interface HistoryAnalyticsProps {
  user: UserProfile;
  menstrualLogs: MenstrualLog[];
  wearableLogs: WearableDataPoint[];
}

const CHART_W = 600;
const CHART_H = 200;
const PAD_X = 12;
const PAD_Y = 20;

export const HistoryAnalyticsView: React.FC<HistoryAnalyticsProps> = ({
  user,
  menstrualLogs,
  wearableLogs,
}) => {
  const [rangeDays, setRangeDays] = useState<number>(14);
  const [tooltip, setTooltip] = useState<{ idx: number } | null>(null);

  const displayLogs = wearableLogs.slice(0, rangeDays).slice().reverse();

  const hrValues = displayLogs.map((l) => l.restingHR);
  const rawMax = Math.max(...hrValues, user.baselineHR + 10, 80);
  const rawMin = Math.min(...hrValues, user.baselineHR - 8, 50);
  const dataRange = rawMax - rawMin || 1;
  const maxHR = rawMax + dataRange * 0.15;
  const minHR = rawMin - dataRange * 0.10;

  const plotW = CHART_W - PAD_X * 2;
  const plotH = CHART_H - PAD_Y * 2;

  const toX = (idx: number) => PAD_X + (idx / (displayLogs.length - 1 || 1)) * plotW;
  const toY = (hr: number) => PAD_Y + plotH - ((hr - minHR) / (maxHR - minHR)) * plotH;

  const points = displayLogs.map((log, idx) => ({
    x: toX(idx),
    y: toY(log.restingHR),
    log,
    isPeriod: !!menstrualLogs.find((m) => m.date === log.date)?.isPeriodDay,
  }));

  const linePath = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`;
  }, '');

  const yBase = toY(user.baselineHR);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-purple-200">Analisis Longitudinal</span>
            <h2 className="text-lg font-black mt-0.5">Tren Fisiologis & Haid</h2>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md p-1 rounded-xl">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setRangeDays(days)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  rangeDays === days ? 'bg-white text-purple-700 shadow-xs' : 'text-purple-100 hover:text-white'
                }`}
              >
                {days}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resting HR Chart Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Resting HR vs Baseline ({user.baselineHR} bpm)
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-semibold">Titik Merah = Hari Haid</span>
        </div>

        {displayLogs.length === 0 ? (
          <p className="text-xs text-stone-400 py-8 text-center">Belum ada data tren.</p>
        ) : (
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="w-full"
              style={{ height: 180, display: 'block', overflow: 'visible' }}
            >
              {/* Baseline Line */}
              {yBase >= PAD_Y && yBase <= PAD_Y + plotH && (
                <line
                  x1={PAD_X}
                  y1={yBase}
                  x2={CHART_W - PAD_X}
                  y2={yBase}
                  stroke="#fb7185"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
              )}

              {/* Line */}
              {linePath && <path d={linePath} fill="none" stroke="#e11d48" strokeWidth="2.5" />}

              {/* Points */}
              {points.map((pt, idx) => (
                <g key={pt.log.date}>
                  <circle cx={pt.x} cy={pt.y} r={pt.isPeriod ? 6 : 4} fill={pt.isPeriod ? '#e11d48' : '#3b82f6'} />
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* HRV Bar Chart */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Fluktuasi HRV Harian (ms)
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1 pt-2">
          {displayLogs.slice(0, 7).map((log) => {
            const isPeriod = !!menstrualLogs.find((m) => m.date === log.date)?.isPeriodDay;
            return (
              <div key={log.date} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-stone-500">{log.hrv}</span>
                <div className="w-full h-16 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-end p-1 my-1">
                  <div
                    className={`w-full rounded-md ${isPeriod ? 'bg-rose-500' : 'bg-purple-500'}`}
                    style={{ height: `${Math.min(100, (log.hrv / 80) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] text-stone-400">{parseLocalDate(log.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
