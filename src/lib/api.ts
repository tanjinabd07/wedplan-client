import { authClient } from "./auth-client";

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please sign in again.");
  }

  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}
