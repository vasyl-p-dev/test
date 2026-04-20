// Stub the toast context — authorization provider imports it transitively
// via ToastContext → Toast.tsx, which pulls RN components that jest-expo/node
// can't resolve. Tests here only exercise the pure reducer anyway.
jest.mock('../src/providers/Toast', () => ({
  useToast: () => ({ success: jest.fn(), error: jest.fn() }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import type { SignupResponse } from '../src/api/signup';
import {
  authorizationReducer,
  initialAuthorizationState,
} from '../src/providers/Authorization';

const sampleResponse: SignupResponse = {
  message: 'User signup successful!',
  nextStep: 'Get account details from /interview/account endpoint.',
  basicAuthCredentials: { username: 'user', password: 'civitta' },
};

describe('authorizationReducer', () => {
  it('starts in the restoring state with null response, not yet ready', () => {
    expect(initialAuthorizationState).toEqual({
      status: 'restoring',
      response: null,
      error: null,
      ready: false,
    });
  });

  it('restore → idle, stores response, marks ready', () => {
    const next = authorizationReducer(initialAuthorizationState, {
      type: 'restore',
      response: sampleResponse,
    });
    expect(next.status).toBe('idle');
    expect(next.response).toEqual(sampleResponse);
    expect(next.ready).toBe(true);
  });

  it('restore with null response → idle + ready, no response', () => {
    const next = authorizationReducer(initialAuthorizationState, {
      type: 'restore',
      response: null,
    });
    expect(next).toEqual({ status: 'idle', response: null, error: null, ready: true });
  });

  it('submit → submitting, clears any prior error', () => {
    const next = authorizationReducer(
      { status: 'error', response: null, error: 'old', ready: true },
      { type: 'submit' },
    );
    expect(next.status).toBe('submitting');
    expect(next.error).toBeNull();
  });

  it('success → success, stores response, ready stays true', () => {
    const next = authorizationReducer(
      { status: 'submitting', response: null, error: null, ready: true },
      { type: 'success', response: sampleResponse },
    );
    expect(next).toEqual({
      status: 'success',
      response: sampleResponse,
      error: null,
      ready: true,
    });
  });

  it('failure → error, carries the message, ready stays true', () => {
    const next = authorizationReducer(
      { status: 'submitting', response: null, error: null, ready: true },
      { type: 'failure', error: 'Email taken' },
    );
    expect(next.status).toBe('error');
    expect(next.error).toBe('Email taken');
    expect(next.ready).toBe(true);
  });

  it('failure from the restoring state flips ready → true', () => {
    const next = authorizationReducer(initialAuthorizationState, {
      type: 'failure',
      error: 'Storage unavailable',
    });
    expect(next).toEqual({
      status: 'error',
      response: null,
      error: 'Storage unavailable',
      ready: true,
    });
  });

  it('reset clears response and returns to idle, still ready', () => {
    const next = authorizationReducer(
      { status: 'success', response: sampleResponse, error: null, ready: true },
      { type: 'reset' },
    );
    expect(next).toEqual({ status: 'idle', response: null, error: null, ready: true });
  });
});
