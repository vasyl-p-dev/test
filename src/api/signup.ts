import { post } from "../services/httpClient";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface BasicAuthCredentials {
  username: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  nextStep: string;
  basicAuthCredentials: BasicAuthCredentials;
}

export function signup(payload: SignupPayload): Promise<SignupResponse> {
  return post<SignupPayload, SignupResponse>("/signup", payload);
}
