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
  isFirstLaunch: boolean;
  setOnboardingFinished: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: FC<OnboardingProviderProps> = ({ children }) => {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [isOnboardingFinished, setIsOnboardingFinished] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const value = await getIsOnboardingFinished();
        if (cancelled) return;
        setIsOnboardingFinished(value);
        setIsFirstLaunch(!value);
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
      // Own the full failure outcome so callers never need a try/catch —
      // mirrors useAuthorization.signUp. Toast + dev log here; state stays
      // unchanged so a retry can succeed.
      if (__DEV__) console.warn('Failed to save onboarding state:', error);
      toast.error("Couldn't save your progress");
    }
  }, [toast]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ready,
      isOnboardingFinished,
      isFirstLaunch,
      setOnboardingFinished,
    }),
    [ready, isOnboardingFinished, isFirstLaunch, setOnboardingFinished],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
