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
  finishOnboarding,
  getIsOnboardingFinished,
  resetOnboarding,
} from '../src/services/onboarding';

const ONBOARDING_STORAGE_KEY = '@app/onboarding';

const getItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const setItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const removeItem = AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>;

describe('onboarding service', () => {
  beforeEach(() => {
    getItem.mockReset();
    setItem.mockReset();
    removeItem.mockReset();
  });

  it("finishOnboarding writes 'true' under @app/onboarding", () => {
    setItem.mockResolvedValueOnce(undefined);
    finishOnboarding();
    expect(setItem).toHaveBeenCalledWith(ONBOARDING_STORAGE_KEY, 'true');
  });

  it("getIsOnboardingFinished resolves to true only for the exact string 'true'", () => {
    getItem.mockResolvedValueOnce('true');
    return expect(getIsOnboardingFinished()).resolves.toBe(true);
  });

  it('getIsOnboardingFinished resolves to false for any other value', () => {
    getItem.mockResolvedValueOnce('1');
    return expect(getIsOnboardingFinished()).resolves.toBe(false);
  });

  it('getIsOnboardingFinished resolves to false when the flag is absent', () => {
    getItem.mockResolvedValueOnce(null);
    return expect(getIsOnboardingFinished()).resolves.toBe(false);
  });

  it('resetOnboarding removes the key', () => {
    removeItem.mockResolvedValueOnce(undefined);
    resetOnboarding();
    expect(removeItem).toHaveBeenCalledWith(ONBOARDING_STORAGE_KEY);
  });
});
