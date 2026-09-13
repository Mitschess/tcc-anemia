import React from 'react';

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-[var(--surface)] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="max-w-2xl space-y-1.5">
        <h1 className="text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          {title}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function SectionHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
        {hint && (
          <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">{hint}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#9f2d3a] hover:bg-[#7f1d2a] disabled:opacity-45 disabled:pointer-events-none text-white text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-sm font-medium px-3.5 py-2.5 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function TextLink({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`text-sm font-medium text-[#9f2d3a] dark:text-rose-400 hover:underline cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function Notice({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'warn' | 'ok';
}) {
  const tones = {
    neutral: 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300',
    warn: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200',
    ok: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300',
  };
  return (
    <div className={`rounded-xl border px-3.5 py-3 text-sm leading-relaxed ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[13px] font-medium text-stone-700 dark:text-stone-300 mb-1.5">
      {children}
    </label>
  );
}

export const inputClass =
  'w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9f2d3a]/25 focus:border-[#9f2d3a]';
