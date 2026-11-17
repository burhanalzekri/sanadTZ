import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  function handle(value: boolean) {
    if (state) {
      state.resolve(value);
      setState(null);
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div className="confirm-overlay" onClick={() => handle(false)} role="dialog" aria-modal="true">
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className={`confirm-icon ${state.options.danger ? 'danger' : 'warning'}`}>
              {state.options.danger ? '⚠️' : '?'}
            </div>
            <h3 className="confirm-title">{state.options.title}</h3>
            <p className="confirm-message">{state.options.message}</p>
            {state.options.danger && <p className="confirm-warning">⚠️ هذا الإجراء لا يمكن التراجع عنه.</p>}
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => handle(false)}>
                {state.options.cancelText || 'إلغاء'}
              </button>
              <button className={`confirm-confirm ${state.options.danger ? 'danger' : ''}`} onClick={() => handle(true)}>
                {state.options.confirmText || 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}
