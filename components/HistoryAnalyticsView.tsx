'use client';

import React, { useState } from 'react';
import { UserProfile, MenstrualLog, WearableDataPoint } from '../types/anemia';
import { parseLocalDate } from '../lib/screeningEngine';
import { Card, PageIntro } from './ui';

interface HistoryAnalyticsProps {
  user: UserProfile;
  menstrualLogs: MenstrualLog[];
  wearableLogs: WearableDataPoint[];
}

export const HistoryAnalyticsView: React.FC<HistoryAnalyticsProps> = ({
  user,
  menstrualLogs,
  wearableLogs,
}) => {
  const [rangeDays, setRangeDays] = useState<number>(14);
  const displayLogs = wearableLogs.slice(0, rangeDays).slice().reverse();

  const hrValues = displayLogs.map((l) => l.restingHR);
  const maxHR = Math.max(...hrValues, user.baselineHR + 10, 80);
  const minHR = Math.min(...hrValues, user.baselineHR - 8, 50);

  // Compute normalized coordinates (0-100) for points
  const points = displayLogs.map((log, idx) => {
    const x = (idx / (displayLogs.length - 1 || 1)) * 100;
    const y = 100 - ((log.restingHR - minHR) / (maxHR - minHR || 1)) * 100;
    const isPeriod = menstrualLogs.find((m) => m.date === log.date)?.isPeriodDay;
    return { x, y, log, isPeriod };
  });

  // Generate smooth cubic bezier SVG path
  const linePathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  // Generate closed area path for gradient fill under the line
  const areaPathD = points.length > 0
    ? `${linePathD} L ${points[points.length - 1].x},100 L ${points[0].x},100 Z`
    : '';

  const yBase = 100 - ((user.baselineHR - minHR) / (maxHR - minHR || 1)) * 100;

  return (
    <div className="space-y-6">
      <PageIntro
        title="Tren fisiologis"
        description="Hubungan Resting HR, HRV, dan hari haid. Titik merah = hari perdarahan."
        action={
          <div className="flex items-center gap-1 p-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer transition-colors ${
                  rangeDays === days
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {days}h
              </button>
            ))}
          </div>
        }
      />

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Resting HR vs baseline</h2>
            <p className="text-[13px] text-stone-500 mt-0.5">Garis putus-putus adalah baseline {user.baselineHR} bpm</p>
          </div>
          <div className="flex gap-4 text-[12px] font-medium text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Biasa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9f2d3a]" /> Haid
            </span>
          </div>
        </div>

        {displayLogs.length === 0 ? (
          <p className="text-sm text-stone-500 py-10 text-center">Belum ada data untuk ditampilkan.</p>
        ) : (
          <div>
            <div className="relative h-60 w-full px-2">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#78716c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#78716c" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="currentColor"
                    className="text-stone-200 dark:text-stone-800"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* Baseline line */}
                <line
                  x1="0"
                  y1={yBase}
                  x2="100"
                  y2={yBase}
                  stroke="#a8a29e"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Soft gradient fill under curve */}
                {areaPathD && (
                  <path d={areaPathD} fill="url(#hrGradient)" />
                )}

                {/* Smooth curve line */}
                {linePathD && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#57534e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>

              {/* Baseline badge indicator */}
              <div
                className="absolute right-2 text-[10px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700 -translate-y-1/2 pointer-events-none z-10"
                style={{ top: `${yBase}%` }}
              >
                Baseline {user.baselineHR} bpm
              </div>

              {/* HTML Overlay for data point circular nodes & tooltips */}
              <div className="absolute inset-0 pointer-events-none px-2">
                {points.map((pt) => (
                  <div
                    key={pt.log.date}
                    className="absolute pointer-events-auto group -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-stone-900 shadow-md transition-all duration-150 group-hover:scale-150 cursor-pointer ${
                        pt.isPeriod
                          ? 'bg-[#9f2d3a] ring-2 ring-[#9f2d3a]/30'
                          : 'bg-emerald-600 ring-2 ring-emerald-600/30'
                      }`}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                      <div className="bg-stone-900 text-white text-[11px] font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
                        <div className="font-semibold text-xs flex items-center gap-1.5">
                          <span>{pt.log.restingHR} bpm</span>
                          {pt.isPeriod && <span className="bg-rose-500/30 text-rose-300 text-[10px] px-1.5 py-0.2 rounded font-normal">Haid</span>}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {parseLocalDate(pt.log.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-stone-900 rotate-45 -mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis date labels accurately positioned below points */}
            <div className="relative h-6 mt-4 px-2">
              {points
                .filter((_, i, arr) => {
                  const maxLabels = 7;
                  const step = Math.max(1, Math.floor((arr.length - 1) / (maxLabels - 1)));
                  return i % step === 0 || i === arr.length - 1;
                })
                .map((pt) => (
                  <span
                    key={pt.log.date}
                    className="absolute text-[11px] text-stone-400 dark:text-stone-500 -translate-x-1/2 whitespace-nowrap font-medium"
                    style={{ left: `${pt.x}%` }}
                  >
                    {parseLocalDate(pt.log.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">HRV harian</h2>
            <p className="text-[13px] text-stone-500 mt-0.5">Batang merah menandai hari perdarahan haid.</p>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-44 overflow-x-auto pt-6 pb-2 px-1">
          {displayLogs.map((log) => {
            const isPeriod = menstrualLogs.find((m) => m.date === log.date)?.isPeriodDay;
            const height = Math.max(15, Math.min(100, ((log.hrv - 20) / 60) * 100));
            return (
              <div key={log.date} className="flex-1 min-w-[20px] flex flex-col items-center gap-1.5 h-full justify-end group relative">
                <span className="text-[10px] text-stone-400 group-hover:font-semibold group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
                  {log.hrv}
                </span>
                <div
                  title={`${log.date}: HRV ${log.hrv} ms`}
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-t-md transition-all duration-150 group-hover:brightness-110 ${
                    isPeriod ? 'bg-[#9f2d3a] shadow-xs' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                />
                <span className="text-[10px] text-stone-400 font-medium">
                  {parseLocalDate(log.date).getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

