import API from "./axios";

async function postAuth(path, body) {
  const res = await API.post(path, body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Request failed");
  }
  return res.data?.data;
}

/**
 * POST /api/auth/login — body: { email, password }
 * @returns {Promise<{ token: string, user?: object }>}
 */
export async function loginRequest(body) {
  const data = await postAuth("/auth/login", body);
  if (!data?.token) {
    throw new Error("Login failed: invalid response");
  }
  return data;
}

/**
 * POST /api/auth/{userType}/login — restricted role login endpoint.
 */
export async function loginRequestByType(body, userType = "user") {
  if (userType === "user") {
    return loginRequest(body);
  }
  const data = await postAuth(`/auth/${userType}/login`, body);
  if (!data?.token) {
    throw new Error("Login failed: invalid response");
  }
  return data;
}

/**
 * POST /api/auth/signup — body: { name, email, password }
 * @returns {Promise<{ id?: number }>}
 */
export async function signupRequest(body) {
  return (await postAuth("/auth/signup", body)) ?? {};
}

/**
 * POST /api/auth/{userType}/signup — creates role-specific account.
 */
export async function signupRequestByType(body, userType = "user") {
  if (userType === "user") {
    return signupRequest(body);
  }
  return (await postAuth(`/auth/${userType}/signup`, body)) ?? {};
}

/** POST /api/auth/logout — requires Bearer (ignored if unauthenticated). */
export async function logoutRequest() {
  await API.post("/auth/logout");
}
