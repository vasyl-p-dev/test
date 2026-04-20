import { getAuthenticationToken } from "./authentication";

// ── Public surface ──────────────────────────────────────────────────────────
// `get` takes one generic (Response) since it has no body — headers/timeout
// travel through `RequestOptions`. `post` keeps two generics <Request, Response>
// because it also needs to type the request body.

export function get<Response>(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  return request<Response>(path, { method: "GET" }, options);
}

export function post<Request, Response>(
  path: string,
  body: Request,
  options: RequestOptions = {},
): Promise<Response> {
  return request<Response>(
    path,
    { method: "POST", body: JSON.stringify(body) },
    options,
  );
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ── Module-local (not exported) ─────────────────────────────────────────────

interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
}

const BASE_URL = "https://artjoms-spole.fly.dev";
const DEFAULT_TIMEOUT_MS = 15000;

async function request<T>(
  path: string,
  init: RequestInit,
  { headers, timeoutMs }: RequestOptions,
): Promise<T> {
  // Auth token is fetched from the authentication service on every call — no
  // in-memory cache here, no direct AsyncStorage access. The service hands
  // back the raw token string; the `Basic ` scheme prefix is built locally.
  const token = await getAuthenticationToken();
  const authHeader = token ? `Basic ${token}` : null;

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : null),
        ...headers,
      },
    });

    const text = await res.text();
    const body = text ? safeJson(text) : null;

    if (!res.ok) {
      const message =
        extractMessage(body) ?? `Request failed with status ${res.status}`;
      throw new ApiError(res.status, message, body);
    }
    return body;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(
        0,
        "Request timed out. Check your connection and try again.",
        null,
      );
    }
    throw new ApiError(
      0,
      "Network error. Check your connection and try again.",
      null,
    );
  } finally {
    clearTimeout(timer);
  }
}

// JSON.parse returns `any`, which is assignable to any T via the function's return type.
function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    if ("error" in body && typeof body.error === "string") return body.error;
    if ("message" in body && typeof body.message === "string")
      return body.message;
  }
  return undefined;
}
