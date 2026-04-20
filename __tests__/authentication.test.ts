jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearAuthenticationToken,
  getAuthenticationToken,
  setAuthenticationToken,
} from '../src/services/authentication';

const AUTHENTICATION_STORAGE_KEY = '@app/authentication';

const getItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const setItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const removeItem = AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>;

describe('authentication service', () => {
  beforeEach(() => {
    getItem.mockReset();
    setItem.mockReset();
    removeItem.mockReset();
  });

  it('setAuthenticationToken stores the raw string under @app/authentication', () => {
    setItem.mockResolvedValueOnce(undefined);
    setAuthenticationToken('xyz');
    expect(setItem).toHaveBeenCalledWith(AUTHENTICATION_STORAGE_KEY, 'xyz');
  });

  it('setAuthenticationToken(null) removes the key', () => {
    removeItem.mockResolvedValueOnce(undefined);
    setAuthenticationToken(null);
    expect(removeItem).toHaveBeenCalledWith(AUTHENTICATION_STORAGE_KEY);
  });

  it('getAuthenticationToken resolves to whatever AsyncStorage returns', () => {
    getItem.mockResolvedValueOnce('dXNlcjpjaXZpdHRh');
    return expect(getAuthenticationToken()).resolves.toBe('dXNlcjpjaXZpdHRh');
  });

  it('getAuthenticationToken resolves to null when unset', () => {
    getItem.mockResolvedValueOnce(null);
    return expect(getAuthenticationToken()).resolves.toBeNull();
  });

  it('clearAuthenticationToken removes the key', () => {
    removeItem.mockResolvedValueOnce(undefined);
    clearAuthenticationToken();
    expect(removeItem).toHaveBeenCalledWith(AUTHENTICATION_STORAGE_KEY);
  });
});
