import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  finishOnboarding,
  getIsOnboardingFinished,
} from '../services/onboarding';
import { useToast } from './Toast';

interface OnboardingContextValue {
  ready: boolean;
  isOnboardingFinished: boolean;
  setOnboardingFinished: () => Promise<void>;
}

// Provider-scoped state — a single source of truth shared by every call site
// (the navigator's `if` hooks + the OnboardingScreen finish handler). Matches
// the Provider pattern used by AuthorizationProvider so both auth-adjacent
// hooks follow the same mental model.
const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: FC<OnboardingProviderProps> = ({ children }) => {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [isOnboardingFinished, setIsOnboardingFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const value = await getIsOnboardingFinished();
        if (cancelled) return;
        setIsOnboardingFinished(value);
      } catch (error) {
        if (__DEV__) console.warn('Failed to restore onboarding flag:', error);
        if (!cancelled) toast.error("Couldn't check onboarding status");
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const setOnboardingFinished = useCallback(async () => {
    try {
      await finishOnboarding();
      setIsOnboardingFinished(true);
    } catch (error) {
      if (__DEV__) console.warn('Failed to save onboarding state:', error);
      toast.error("Couldn't save your progress");
      throw error;
    }
  }, [toast]);

  const value = useMemo<OnboardingContextValue>(
    () => ({ ready, isOnboardingFinished, setOnboardingFinished }),
    [ready, isOnboardingFinished, setOnboardingFinished],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
