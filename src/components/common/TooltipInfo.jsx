import React from 'react';
import { HelpCircle } from 'lucide-react';

export const TooltipInfo = ({ text }) => (
  <div className="group relative ml-1.5 inline-flex items-center justify-center no-print">
    <HelpCircle className="w-3.5 h-3.5 text-stone-400 hover:text-orange-500 cursor-help transition-colors" />
    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-stone-900 text-white text-[11px] font-medium leading-relaxed rounded-lg shadow-xl z-50 text-center transition-all duration-200 scale-95 group-hover:scale-100 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900"></div>
    </div>
  </div>
);

