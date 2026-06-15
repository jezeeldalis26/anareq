import React from 'react';

export const DashboardSkeleton = ({ label = '' }) => (
  <div className="space-y-6 w-full max-w-6xl mx-auto anareq-panel-enter" role="status" aria-live="polite">
    <div className="relative overflow-hidden bg-white p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-sm min-h-48 flex flex-col justify-between">
      <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-orange-100/70 blur-2xl anareq-skeleton-orb" />
      <div className="absolute -left-16 bottom-0 h-28 w-28 rounded-full bg-stone-100 blur-2xl" />

      <div className="relative flex justify-between gap-6 w-full">
        <div className="space-y-4 w-full max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[11px] font-black uppercase tracking-wide text-orange-700">
              {label}
            </span>
          </div>
          <div className="h-8 anareq-shimmer rounded-xl w-3/4" />
          <div className="h-4 anareq-shimmer rounded-lg w-1/2" />
        </div>

        <div className="hidden sm:flex h-20 w-32 rounded-3xl border border-stone-100 bg-stone-50 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-stone-200 border-t-orange-500 animate-spin" />
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
        <div className="h-14 anareq-shimmer rounded-2xl" />
        <div className="h-14 anareq-shimmer rounded-2xl" />
        <div className="h-14 anareq-shimmer rounded-2xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-40 anareq-shimmer rounded-3xl border border-stone-100" />
      <div className="h-40 anareq-shimmer rounded-3xl border border-stone-100" />
    </div>
  </div>
);
