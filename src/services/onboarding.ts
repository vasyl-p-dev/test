import AsyncStorage from "@react-native-async-storage/async-storage";

// Mirrors the authentication service: single responsibility is persisting the
// "onboarding finished" flag. No React, no side effects beyond AsyncStorage.
const ONBOARDING_STORAGE_KEY = "@app/onboarding";

export async function finishOnboarding(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
}

export async function getIsOnboardingFinished(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
  return value === "true";
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
