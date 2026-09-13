import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { ToastContext } from './toast';
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts(previous => [...previous.slice(-3), { id, message, type }]);
  }, []);
  return <ToastContext.Provider value={{ addToast }}>
    {children}
    <div aria-live="polite" className="fixed bottom-6 right-4 z-50 w-80 max-w-[90vw] space-y-3">
      {toasts.map(toast => <div key={toast.id} className={'neu-flat rounded-xl p-4 flex gap-3 ' + (toast.type === 'error' ? 'text-rose-800' : 'text-slate-800')}>
        <p className="text-sm flex-1">{toast.message}</p>
        <button aria-label="Dismiss notification" onClick={() => setToasts(previous => previous.filter(item => item.id !== toast.id))}><X size={18} /></button>
      </div>)}
    </div>
  </ToastContext.Provider>;
}
