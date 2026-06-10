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
    <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out_forwards] no-print">
      <div className="bg-stone-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
        <div className="bg-green-500/20 p-1.5 rounded-full">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{message.title}</p>
          <p className="text-xs text-stone-400 font-medium">{message.desc}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-stone-500 hover:text-white transition-colors">
          &times;
        </button>
      </div>
    </div>
  );
};

