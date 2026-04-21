import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTHENTICATION_STORAGE_KEY = "@app/authentication";

export async function setAuthenticationToken(
  token: string | null,
): Promise<void> {
  if (!token) {
    await AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);
}

export function getAuthenticationToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export async function clearAuthenticationToken(): Promise<void> {
  await AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
}
