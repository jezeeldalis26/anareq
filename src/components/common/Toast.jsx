import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] z-50 no-print anareq-toast-wrap" aria-live="polite">
      <div className="anareq-toast-card bg-stone-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-stone-700 flex items-start gap-3">
        <div className="anareq-toast-icon bg-green-500/20 p-1.5 rounded-full shrink-0 mt-0.5">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white leading-tight">{message.title}</p>
          <p className="text-xs text-stone-400 font-medium leading-relaxed mt-0.5">{message.desc}</p>
        </div>
        <button onClick={onClose} className="ml-2 text-stone-500 hover:text-white transition-colors text-xl leading-none" aria-label="Cerrar notificación">
          &times;
        </button>
      </div>
    </div>
  );
};
