import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#38BDF8] shrink-0" />,
        };

        const borders = {
          success: 'border-[#22C55E]/30',
          warning: 'border-[#F59E0B]/30',
          error: 'border-[#EF4444]/30',
          info: 'border-[#38BDF8]/30',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#111827] border ${borders[toast.type]} rounded-xl p-4 shadow-xl flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            {icons[toast.type]}
            <div className="flex-1">
              <h5 className="text-xs font-semibold text-[#F8FAFC]">{toast.title}</h5>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#64748B] hover:text-[#F8FAFC] p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
