import React from 'react';

export const BenchmarkTag = ({ status, text }) => {
  const colors = {
    good: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    neutral: 'bg-stone-100 text-stone-600 border-stone-200'
  };
  return (
    <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md border ${colors[status] || colors.neutral}`}>
      {text}
    </span>
  );
};

