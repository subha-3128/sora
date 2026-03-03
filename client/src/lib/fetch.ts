import { supabase } from "./supabase";
import { config } from "./config";

/**
 * Wraps fetch to automatically add Supabase JWT token to Authorization header.
 * Use this instead of direct fetch() for API calls that need authentication.
 */
export async function authenticatedFetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init?.headers);

  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  // Use configured API URL
  const fullUrl = config.getApiUrl(url);

  return fetch(fullUrl, {
    ...init,
    headers,
  });
}

export async function getResponseErrorMessage(
  res: Response,
  fallback: string
): Promise<string> {
  try {
    const payload = await res.clone().json();
    if (payload && typeof payload.message === "string" && payload.message.trim()) {
      return `${fallback}: ${payload.message}`;
    }
  } catch {
  }

  try {
    const text = await res.text();
    if (text && text.trim()) {
      return `${fallback}: ${text}`;
    }
  } catch {
  }

  return fallback;
}
