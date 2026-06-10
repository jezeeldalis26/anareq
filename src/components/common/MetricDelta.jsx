import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { safeNum } from '../../utils/safeMath';

export const MetricDelta = ({ current, previous, inverse = false, isPercent = false, isCurrency = false, currencySymbol = '$' }) => {
  if (previous === undefined || previous === null) return null;
  const currSafe = safeNum(current);
  const prevSafe = safeNum(previous);
  const diff = currSafe - prevSafe;
  if (diff === 0) return null;
  
  const isGood = inverse ? diff < 0 : diff > 0;
  const formattedDiff = Math.abs(diff).toLocaleString('en-US', {
    minimumFractionDigits: isPercent || Math.abs(diff) < 10 ? 1 : 0,
    maximumFractionDigits: isPercent || Math.abs(diff) < 10 ? 2 : 0
  });

  return (
    <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isGood ? (inverse ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />) : 
                (inverse ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />)}
      <span>{isCurrency ? currencySymbol : ''}{formattedDiff}{isPercent ? '%' : inverse ? '' : 'x'}</span>
    </div>
  );
};

