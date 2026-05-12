const TOKEN_KEY = "token";
const USER_KEY = "vital_user";

export function setAuthCookie(token) {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; samesite=lax`;
}

/** Persist JWT and optional safe user summary (no password). */
export function persistAuth({ token, user }) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  setAuthCookie(token);
  if (user && typeof user === "object") {
    const safe = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    if (safe.id != null || safe.email) {
      localStorage.setItem(USER_KEY, JSON.stringify(safe));
    }
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "token=; path=/; max-age=0";
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Cookie first (matches axios), then localStorage. */
export function getAuthToken() {
  const cookie = document.cookie.split("; ").find((item) => item.startsWith("token="));
  if (cookie) {
    try {
      return decodeURIComponent(cookie.split("=")[1]);
    } catch {
      return null;
    }
  }
  return getStoredToken();
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
