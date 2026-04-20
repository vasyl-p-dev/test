import { post } from '../services/httpClient';

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
  // Generics mirror the wire shape: <Request body, Response body>.
  return post<SignupPayload, SignupResponse>('/signup', payload);
}
