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

// SVG chart dimensions with internal padding so dots never clip
const CHART_W = 600;
const CHART_H = 220;
const PAD_X = 8;
const PAD_Y = 22; // top/bottom room for dots

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
  // Add padding to data range so points never touch the edge
  const dataRange = rawMax - rawMin || 1;
  const maxHR = rawMax + dataRange * 0.15;
  const minHR = rawMin - dataRange * 0.10;

  const plotW = CHART_W - PAD_X * 2;
  const plotH = CHART_H - PAD_Y * 2;

  const toX = (idx: number) =>
    PAD_X + (idx / (displayLogs.length - 1 || 1)) * plotW;
  const toY = (hr: number) =>
    PAD_Y + plotH - ((hr - minHR) / (maxHR - minHR)) * plotH;

  const points = displayLogs.map((log, idx) => ({
    x: toX(idx),
    y: toY(log.restingHR),
    log,
    isPeriod: !!menstrualLogs.find((m) => m.date === log.date)?.isPeriodDay,
  }));

  // Smooth bezier path
  const linePath = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`;
  }, '');

  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${PAD_Y + plotH} L ${points[0].x} ${PAD_Y + plotH} Z`
      : '';

  const yBase = toY(user.baselineHR);

  // Which point indices show an x-axis label (max 7)
  const labelIndices = (() => {
    const n = displayLogs.length;
    if (n <= 7) return displayLogs.map((_, i) => i);
    const step = Math.floor((n - 1) / 6);
    const idxs = Array.from({ length: 7 }, (_, k) => Math.min(k * step, n - 1));
    if (idxs[idxs.length - 1] !== n - 1) idxs[idxs.length - 1] = n - 1;
    return [...new Set(idxs)];
  })();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Tren fisiologis"
        description="Resting HR, HRV, dan hari haid. Titik merah = hari perdarahan."
        action={
          <div className="flex items-center gap-1 p-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer transition-colors ${
                  rangeDays === days
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {days}h
              </button>
            ))}
          </div>
        }
      />

      {/* ── Resting HR Chart ── */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div>
            <h2 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100">
              Resting HR vs baseline
            </h2>
            <p className="text-[13px] text-stone-500 mt-0.5">
              Garis putus-putus = baseline {user.baselineHR} bpm
            </p>
          </div>
          <div className="flex gap-4 text-[12px] font-medium text-stone-500 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              Biasa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9f2d3a] shrink-0" />
              Haid
            </span>
          </div>
        </div>

        {displayLogs.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">
            Belum ada data untuk ditampilkan.
          </p>
        ) : (
          <div>
            {/* SVG chart — viewBox has built-in padding so dots never clip */}
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="w-full"
              style={{ height: 240, display: 'block', overflow: 'visible' }}
              onMouseLeave={() => setTooltip(null)}
            >
              <defs>
                <linearGradient id="hrAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#57534e" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#57534e" stopOpacity="0" />
                </linearGradient>
                <clipPath id="chartClip">
                  <rect x={PAD_X} y={PAD_Y} width={plotW} height={plotH} />
                </clipPath>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const gy = PAD_Y + t * plotH;
                const hrVal = Math.round(maxHR - t * (maxHR - minHR));
                return (
                  <g key={t}>
                    <line
                      x1={PAD_X}
                      y1={gy}
                      x2={CHART_W - PAD_X}
                      y2={gy}
                      stroke="#e7e5e4"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD_X - 4}
                      y={gy + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#a8a29e"
                    >
                      {hrVal}
                    </text>
                  </g>
                );
              })}

              {/* Baseline dashed line */}
              {yBase >= PAD_Y && yBase <= PAD_Y + plotH && (
                <line
                  x1={PAD_X}
                  y1={yBase}
                  x2={CHART_W - PAD_X}
                  y2={yBase}
                  stroke="#d6d3d1"
                  strokeDasharray="5 4"
                  strokeWidth="1.5"
                />
              )}

              {/* Area fill */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill="url(#hrAreaGrad)"
                  clipPath="url(#chartClip)"
                />
              )}

              {/* Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#44403c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Invisible wide hit areas for hover */}
              {points.map((pt, idx) => (
                <rect
                  key={`hit-${pt.log.date}`}
                  x={pt.x - plotW / displayLogs.length / 2}
                  y={PAD_Y}
                  width={plotW / displayLogs.length}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setTooltip({ idx })}
                />
              ))}

              {/* Data point dots */}
              {points.map((pt, idx) => {
                const isHovered = tooltip?.idx === idx;
                return (
                  <g key={pt.log.date}>
                    {/* Outer ring on hover */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={10}
                        fill={pt.isPeriod ? 'rgba(159,45,58,0.12)' : 'rgba(5,150,105,0.12)'}
                      />
                    )}
                    {/* White border */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : (pt.isPeriod ? 6 : 5)}
                      fill="white"
                    />
                    {/* Filled dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : (pt.isPeriod ? 4.5 : 3.5)}
                      fill={pt.isPeriod ? '#9f2d3a' : '#059669'}
                    />
                  </g>
                );
              })}

              {/* Tooltip */}
              {tooltip !== null && (() => {
                const pt = points[tooltip.idx];
                const tipW = 96;
                const tipH = 44;
                const tipX = Math.min(Math.max(pt.x - tipW / 2, PAD_X), CHART_W - PAD_X - tipW);
                const tipY = pt.y - tipH - 12;
                return (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={tipX}
                      y={tipY}
                      width={tipW}
                      height={tipH}
                      rx="6"
                      fill="#1c1917"
                    />
                    {/* Caret */}
                    <polygon
                      points={`${pt.x - 5},${tipY + tipH} ${pt.x + 5},${tipY + tipH} ${pt.x},${tipY + tipH + 6}`}
                      fill="#1c1917"
                    />
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + 17}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="600"
                      fill="white"
                    >
                      {pt.log.restingHR} bpm
                    </text>
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + 34}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#a8a29e"
                    >
                      {parseLocalDate(pt.log.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {pt.isPeriod ? ' · Haid' : ''}
                    </text>
                  </g>
                );
              })()}

              {/* X-axis date labels */}
              {labelIndices.map((idx) => {
                const pt = points[idx];
                return (
                  <text
                    key={`label-${pt.log.date}`}
                    x={pt.x}
                    y={CHART_H - 2}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#a8a29e"
                  >
                    {parseLocalDate(pt.log.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </text>
                );
              })}
            </svg>
          </div>
        )}
      </Card>

      {/* ── HRV Chart ── */}
      <Card>
        <div className="mb-5">
          <h2 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100">
            HRV harian
          </h2>
          <p className="text-[13px] text-stone-500 mt-0.5">
            Batang merah = hari perdarahan haid
          </p>
        </div>

        {displayLogs.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">
            Belum ada data untuk ditampilkan.
          </p>
        ) : (() => {
          const hrvValues = displayLogs.map((l) => l.hrv);
          const maxHRV = Math.max(...hrvValues, 1);
          const minHRV = Math.min(...hrvValues, 0);
          const hrBarW = CHART_W;
          const hrBarH = 160;
          const barPadY = 24;
          const barPlotH = hrBarH - barPadY - 20; // 20 for date labels
          const barCount = displayLogs.length;
          const gapFrac = 0.25; // 25% of slot as gap
          const slotW = hrBarW / barCount;
          const barW = slotW * (1 - gapFrac);

          return (
            <svg
              viewBox={`0 0 ${hrBarW} ${hrBarH}`}
              className="w-full"
              style={{ height: 180, display: 'block' }}
            >
              {/* Zero baseline */}
              <line
                x1={0}
                y1={barPadY + barPlotH}
                x2={hrBarW}
                y2={barPadY + barPlotH}
                stroke="#e7e5e4"
                strokeWidth="1"
              />

              {displayLogs.map((log, idx) => {
                const isPeriod = !!menstrualLogs.find((m) => m.date === log.date)?.isPeriodDay;
                const cx = slotW * idx + slotW / 2;
                const frac = Math.max(0.05, (log.hrv - minHRV) / (maxHRV - minHRV || 1));
                const bh = frac * barPlotH;
                const by = barPadY + barPlotH - bh;

                return (
                  <g key={log.date}>
                    {/* Value label */}
                    <text
                      x={cx}
                      y={by - 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#a8a29e"
                    >
                      {log.hrv}
                    </text>
                    {/* Bar */}
                    <rect
                      x={cx - barW / 2}
                      y={by}
                      width={barW}
                      height={bh}
                      rx="3"
                      fill={isPeriod ? '#9f2d3a' : '#d6d3d1'}
                    />
                    {/* Date label */}
                    <text
                      x={cx}
                      y={barPadY + barPlotH + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#a8a29e"
                    >
                      {parseLocalDate(log.date).getDate()}
                    </text>
                  </g>
                );
              })}
            </svg>
          );
        })()}
      </Card>
    </div>
  );
};
