import { ApiError, get } from '../services/httpClient';
import type { SignupResponse } from './signup';

export interface AccountTransaction {
  name: string;
  bank: string;
  time: string;
  amount: number;
}

export interface AccountResponse {
  accountType: string;
  accountNumber: string;
  availableBalance: number;
  currency: string;
  dateAdded: string;
  transactions: AccountTransaction[];
}

// The endpoint is discovered at runtime from the signup response's `nextStep`
// instruction. Auth is attached by the httpClient automatically (reads the
// token from the authentication service).
export async function getMyAccount(response: SignupResponse): Promise<AccountResponse> {
  const endpoint = extractEndpoint(response.nextStep);
  if (!endpoint) {
    throw new ApiError(0, 'Could not determine account endpoint from signup response.', null);
  }
  return get<AccountResponse>(endpoint);
}

// Pulls the first path-shaped token from the nextStep sentence.
// e.g. "Get account details from /interview/account endpoint..." → "/interview/account"
function extractEndpoint(nextStep: string): string | null {
  const match = nextStep.match(/\/[\w/-]+/);
  return match ? match[0] : null;
}
