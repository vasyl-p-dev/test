jest.mock('../src/services/authentication', () => ({
  getAuthenticationToken: jest.fn(),
  setAuthenticationToken: jest.fn(),
  clearAuthenticationToken: jest.fn(),
}));

import { ApiError, get, post } from '../src/services/httpClient';
import { getAuthenticationToken } from '../src/services/authentication';

const fetchSpy = jest.spyOn(globalThis, 'fetch');
const mockedGetAuthToken = getAuthenticationToken as jest.MockedFunction<typeof getAuthenticationToken>;

// Default: no token. Individual tests override with mockResolvedValueOnce.
afterEach(() => {
  fetchSpy.mockReset();
  mockedGetAuthToken.mockReset();
  mockedGetAuthToken.mockResolvedValue(null);
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('httpClient.get', () => {
  it('resolves with parsed JSON on 2xx', () => {
    mockedGetAuthToken.mockResolvedValueOnce(null);
    fetchSpy.mockResolvedValueOnce(jsonResponse({ ok: true }));
    return expect(get<{ ok: boolean }>('/foo')).resolves.toEqual({ ok: true });
  });

  it('sends method GET and default JSON headers', () => {
    mockedGetAuthToken.mockResolvedValueOnce(null);
    fetchSpy.mockResolvedValueOnce(jsonResponse({}));
    return get<unknown>('/foo').then(() => {
      const init = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(init.method).toBe('GET');
      const headers = init.headers as Record<string, string>;
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers.Accept).toBe('application/json');
    });
  });

  it('attaches Authorization: Basic <token> when a token is present', () => {
    mockedGetAuthToken.mockResolvedValueOnce('dXNlcjpjaXZpdHRh');
    fetchSpy.mockResolvedValueOnce(jsonResponse({}));
    return get<unknown>('/foo').then(() => {
      const headers = (fetchSpy.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
      expect(headers.Authorization).toBe('Basic dXNlcjpjaXZpdHRh');
    });
  });

  it('omits Authorization when the authentication service returns null', () => {
    mockedGetAuthToken.mockResolvedValueOnce(null);
    fetchSpy.mockResolvedValueOnce(jsonResponse({}));
    return get<unknown>('/foo').then(() => {
      const headers = (fetchSpy.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  it('rejects with ApiError carrying the server message on non-2xx', () => {
    mockedGetAuthToken.mockResolvedValueOnce(null);
    fetchSpy.mockResolvedValueOnce(jsonResponse({ message: 'Email taken' }, 409));
    return expect(get<unknown>('/foo')).rejects.toMatchObject({
      name: 'ApiError',
      status: 409,
      message: 'Email taken',
    });
  });

  it('wraps network errors in ApiError with status 0', () => {
    mockedGetAuthToken.mockResolvedValueOnce(null);
    fetchSpy.mockRejectedValueOnce(new TypeError('Network down'));
    return expect(get<unknown>('/foo')).rejects.toMatchObject({
      name: 'ApiError',
      status: 0,
    });
  });
});

describe('httpClient.post', () => {
  it('stringifies the body and uses method POST', () => {
    mockedGetAuthToken.mockResolvedValueOnce(null);
    fetchSpy.mockResolvedValueOnce(jsonResponse({}));
    return post<{ a: number }, unknown>('/foo', { a: 1 }).then(() => {
      const init = fetchSpy.mock.calls[0][1] as RequestInit;
      expect(init.method).toBe('POST');
      expect(init.body).toBe(JSON.stringify({ a: 1 }));
    });
  });
});

// ApiError surface (pure sync, no async)
describe('ApiError', () => {
  it('carries status, message, and body', () => {
    const err = new ApiError(418, 'teapot', { kind: 'pot' });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(418);
    expect(err.message).toBe('teapot');
    expect(err.body).toEqual({ kind: 'pot' });
  });
});
