jest.mock('../src/services/httpClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    body: unknown;
    constructor(status: number, message: string, body: unknown) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.body = body;
    }
  },
}));

import { getMyAccount } from '../src/api/account';
import type { SignupResponse } from '../src/api/signup';
import { ApiError, get } from '../src/services/httpClient';

const mockedGet = get as jest.MockedFunction<typeof get>;

const signupResponse: SignupResponse = {
  message: 'User signup successful!',
  nextStep: 'Get account details from /interview/account endpoint. Use Basic Auth for this request.',
  basicAuthCredentials: { username: 'user', password: 'civitta' },
};

const accountResponse = {
  accountType: 'Savings',
  accountNumber: '1',
  availableBalance: 0,
  currency: 'NGN',
  dateAdded: '',
  transactions: [],
};

describe('getMyAccount()', () => {
  beforeEach(() => mockedGet.mockReset());

  it('extracts the endpoint from signupResponse.nextStep and GETs it', () => {
    mockedGet.mockResolvedValueOnce(accountResponse);

    getMyAccount(signupResponse);

    expect(mockedGet).toHaveBeenCalledTimes(1);
    const [path, options] = mockedGet.mock.calls[0];
    expect(path).toBe('/interview/account');
    // getMyAccount MUST NOT set its own Authorization header — the httpClient
    // reads the token from the authentication service on every call.
    expect(options?.headers).toBeUndefined();
  });

  it('rejects with ApiError when the nextStep contains no path', () => {
    return expect(
      getMyAccount({ ...signupResponse, nextStep: 'No path here' }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
