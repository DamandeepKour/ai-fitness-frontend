import API from "./axios";

/**
 * POST /api/auth/login — body: { email, password }
 * @returns {Promise<{ token: string, user?: object }>}
 */
export async function loginRequest(body) {
  const res = await API.post("/auth/login", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Login failed");
  }
  const data = res.data?.data;
  if (!data?.token) {
    throw new Error(res.data?.message || "Login failed: invalid response");
  }
  return data;
}

/**
 * POST /api/auth/signup — body: { name, email, password }
 * @returns {Promise<{ id?: number }>}
 */
export async function signupRequest(body) {
  const res = await API.post("/auth/signup", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Signup failed");
  }
  return res.data?.data ?? {};
}

/** POST /api/auth/logout — requires Bearer (ignored if unauthenticated). */
export async function logoutRequest() {
  await API.post("/auth/logout");
}
