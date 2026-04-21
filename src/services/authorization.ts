import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SignupResponse } from "../api/signup";

const AUTHORIZATION_STORAGE_KEY = "@app/authorization";

export async function setAuthorization(
  response: SignupResponse,
): Promise<void> {
  await AsyncStorage.setItem(
    AUTHORIZATION_STORAGE_KEY,
    JSON.stringify(response),
  );
}

export async function getAuthorization(): Promise<SignupResponse | null> {
  const raw = await AsyncStorage.getItem(AUTHORIZATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isSignupResponse(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function clearAuthorization(): Promise<void> {
  await AsyncStorage.removeItem(AUTHORIZATION_STORAGE_KEY);
}

function isSignupResponse(value: unknown): value is SignupResponse {
  if (!value || typeof value !== "object") return false;
  if (!("message" in value) || typeof value.message !== "string") return false;
  if (!("nextStep" in value) || typeof value.nextStep !== "string")
    return false;
  if (!("basicAuthCredentials" in value)) return false;
  const creds = value.basicAuthCredentials;
  if (!creds || typeof creds !== "object") return false;
  if (!("username" in creds) || typeof creds.username !== "string")
    return false;
  if (!("password" in creds) || typeof creds.password !== "string")
    return false;
  return true;
}
