import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { signup } from '../api/signup';
import type { SignupPayload, SignupResponse } from '../api/signup';
import {
  clearAuthorization as clearAuthorizationStorage,
  getAuthorization,
  setAuthorization,
} from '../services/authorization';
import { clearAuthenticationToken, setAuthenticationToken } from '../services/authentication';
import { ApiError } from '../services/httpClient';
import { useToast } from './Toast';

export type AuthorizationStatus = 'restoring' | 'idle' | 'submitting' | 'success' | 'error';

export interface AuthorizationState {
  status: AuthorizationStatus;
  response: SignupResponse | null;
  error: string | null;
  ready: boolean;
}

export type AuthorizationAction =
  | { type: 'restore'; response: SignupResponse | null }
  | { type: 'submit' }
  | { type: 'success'; response: SignupResponse }
  | { type: 'failure'; error: string }
  | { type: 'reset' };

export const initialAuthorizationState: AuthorizationState = {
  status: 'restoring',
  response: null,
  error: null,
  ready: false,
};

export function authorizationReducer(
  state: AuthorizationState,
  action: AuthorizationAction,
): AuthorizationState {
  switch (action.type) {
    case 'restore':
      return { status: 'idle', response: action.response, error: null, ready: true };
    case 'submit':
      return { ...state, status: 'submitting', error: null };
    case 'success':
      return { status: 'success', response: action.response, error: null, ready: true };
    case 'failure':
      return { ...state, status: 'error', error: action.error, ready: true };
    case 'reset':
      return { status: 'idle', response: null, error: null, ready: true };
  }
}

interface AuthorizationContextValue {
  state: AuthorizationState;
  signUp: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthorizationContext = createContext<AuthorizationContextValue | null>(null);

interface AuthorizationProviderProps {
  children: ReactNode;
}

export const AuthorizationProvider: FC<AuthorizationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authorizationReducer, initialAuthorizationState);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const response = await getAuthorization();

        if (cancelled) {
          return;
        }

        dispatch({ type: 'restore', response });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to restore your session.';

        if (cancelled) {
          return;
        }

        toast.error("Couldn't restore your session");
        dispatch({ type: 'failure', error: message });
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const signUp = useCallback(
    async (payload: SignupPayload): Promise<void> => {
      dispatch({ type: 'submit' });
      try {
        const response = await signup(payload);
        const { username, password } = response.basicAuthCredentials;
        const token = globalThis.btoa(`${username}:${password}`);

        await setAuthenticationToken(token);
        await setAuthorization(response);

        dispatch({ type: 'success', response });

        toast.success(response.message);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
        dispatch({ type: 'failure', error: message });
        toast.error(message);
      }
    },
    [toast],
  );

  const logout = useCallback(async () => {
    try {
      await clearAuthenticationToken();
      await clearAuthorizationStorage();

      dispatch({ type: 'reset' });
    } catch (error) {
      toast.error("Couldn't fully sign you out — please try again");
      throw error;
    }
  }, [toast]);

  const value = useMemo<AuthorizationContextValue>(
    () => ({ state, signUp, logout }),
    [state, signUp, logout],
  );

  return (
    <AuthorizationContext.Provider value={value}>{children}</AuthorizationContext.Provider>
  );
};

export function useAuthorization(): AuthorizationContextValue {
  const ctx = useContext(AuthorizationContext);
  if (!ctx) throw new Error('useAuthorization must be used inside AuthorizationProvider');
  return ctx;
}
