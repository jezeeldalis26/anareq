import React from 'react';

export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse w-full max-w-6xl mx-auto">
    <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-sm h-48 flex flex-col justify-between">
      <div className="flex justify-between w-full">
        <div className="space-y-3 w-1/2">
          <div className="h-8 bg-stone-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-stone-100 rounded-lg w-1/2"></div>
        </div>
        <div className="h-20 bg-stone-100 rounded-2xl w-1/3"></div>
      </div>
      <div className="h-12 bg-stone-100 rounded-xl w-full mt-4"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-40 bg-stone-200 rounded-3xl border border-stone-100"></div>
      <div className="h-40 bg-stone-100 rounded-3xl border border-stone-100"></div>
    </div>
  </div>
);

