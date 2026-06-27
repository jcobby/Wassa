import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const COOKIE_NAME = "wpn_token";

export type Me = {
  id: string;
  email: string;
  role: "member" | "admin";
  fullName: string;
  status: "active" | "suspended" | "terminated";
};

export async function getMe(): Promise<Me | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME);
  if (!token) return null;

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Cookie: `${COOKIE_NAME}=${token.value}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Me;
  } catch {
    return null;
  }
}

export async function requireAdmin(currentPath: string): Promise<Me> {
  const me = await getMe();
  if (!me) {
    redirect(`/login?next=${encodeURIComponent(currentPath)}`);
  }
  if (me.role !== "admin") {
    redirect("/");
  }
  return me;
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME);
  if (!token) throw new Error("Not authenticated");

  const { json, headers, ...rest } = init;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: {
      Cookie: `${COOKIE_NAME}=${token.value}`,
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });

  const text = await res.text();
  const body = text ? safeJson(text) : null;
  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
