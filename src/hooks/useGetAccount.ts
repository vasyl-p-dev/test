import { useCallback, useState } from 'react';
import type { AccountResponse } from '../api/account';
import { getMyAccount } from '../api/account';
import { useAuthorization } from '../providers/Authorization';
import { useToast } from '../providers/Toast';
import { ApiError } from '../services/httpClient';

export interface UseGetAccountResult {
  data: AccountResponse | null;
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export function useGetAccount(): UseGetAccountResult {
  const { state, logout } = useAuthorization();
  const toast = useToast();
  const response = state.response;

  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!response) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAccount(response);
      setData(res);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error('Your session expired — please sign in again');
        await logout();
        return;
      }
      const message = err instanceof ApiError ? err.message : 'Could not load account.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [response, logout, toast]);

  return { data, loading, error, fetch };
}
