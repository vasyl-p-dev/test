import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Toast, ToastVariant } from '../components/Toast';

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<ToastVariant>('success');
  const [visible, setVisible] = useState(false);

  const show = useCallback((next: string, nextVariant: ToastVariant) => {
    setMessage(next);
    setVariant(nextVariant);
    setVisible(true);
  }, []);

  const success = useCallback((msg: string) => show(msg, 'success'), [show]);
  const error = useCallback((msg: string) => show(msg, 'error'), [show]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ success, error }), [success, error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast message={message} variant={variant} visible={visible} onHide={hide} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
