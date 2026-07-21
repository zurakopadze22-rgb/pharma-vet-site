import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-xl shadow-emerald-500/10',
    info: 'bg-white border-teal-200 text-slate-800 shadow-xl shadow-teal-500/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-xl shadow-rose-500/10',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 ${bgStyles[toast.type] || bgStyles.info} min-w-[280px] max-w-md animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto`}>
      {icons[toast.type] || icons.info}
      <p className="text-xs font-black uppercase tracking-wider flex-1 leading-snug">{toast.message}</p>
      <button 
        onClick={() => removeToast(toast.id)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default Toast;
