jest.mock('../src/services/httpClient', () => ({
  post: jest.fn(),
  get: jest.fn(),
  ApiError: class ApiError extends Error {
    status = 0;
    body: unknown = null;
  },
}));

import { signup } from '../src/api/signup';
import { post } from '../src/services/httpClient';

const mockedPost = post as jest.MockedFunction<typeof post>;

const signupResponse = {
  message: 'ok',
  nextStep: 'next',
  basicAuthCredentials: { username: 'u', password: 'p' },
};

const payload = { name: 'Jane', email: 'j@example.com', password: 'Passw0rd!' };

describe('signup()', () => {
  beforeEach(() => mockedPost.mockReset());

  it('calls post("/signup", payload) with the raw body', () => {
    mockedPost.mockResolvedValueOnce(signupResponse);

    signup(payload);

    // post() is invoked synchronously by signup(); mock calls are captured
    // before the returned Promise resolves, so we can assert without awaiting.
    expect(mockedPost).toHaveBeenCalledTimes(1);
    expect(mockedPost).toHaveBeenCalledWith('/signup', payload);
  });

  it('resolves with whatever post() resolves to', () => {
    mockedPost.mockResolvedValueOnce(signupResponse);
    return expect(signup(payload)).resolves.toEqual(signupResponse);
  });

  it('propagates httpClient errors', () => {
    mockedPost.mockRejectedValueOnce(new Error('boom'));
    return expect(signup(payload)).rejects.toThrow('boom');
  });
});
