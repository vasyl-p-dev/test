import AsyncStorage from "@react-native-async-storage/async-storage";

// This service's only responsibility is persisting the auth *token* — an opaque
// string provided by the caller. It does not know about the `Basic ` scheme,
// the `Authorization` header name, or base64 encoding. Those concerns live with
// the caller (token producer) and the httpClient (header builder).
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
