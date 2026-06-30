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
 * @returns {Promise<{ id?: number, emailSent?: boolean, message?: string }>}
 */
export async function signupRequest(body) {
  const res = await API.post("/auth/signup", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Signup failed");
  }
  return {
    ...(res.data?.data ?? {}),
    message: res.data?.message,
  };
}

/**
 * POST /api/auth/signup/send-code — sends OTP before account creation
 */
export async function sendSignupCodeRequest(body) {
  const res = await API.post("/auth/signup/send-code", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Could not send verification code");
  }
  return {
    ...(res.data?.data ?? {}),
    message: res.data?.message,
  };
}

/**
 * POST /api/auth/verify-email — body: { email }
 */
export async function verifyEmailRequest(email) {
  const res = await API.post("/auth/verify-email", { email });
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Invalid email");
  }
  return res.data?.data ?? {};
}

/**
 * POST /api/auth/google — body: { credential }
 */
export async function googleAuthRequest(credential) {
  const data = await postAuth("/auth/google", { credential });
  if (!data?.token) {
    throw new Error("Google sign-in failed: invalid response");
  }
  return data;
}

/**
 * POST /api/auth/magic-login — body: { token }
 */
export async function magicLoginRequest(token) {
  const data = await postAuth("/auth/magic-login", { token });
  if (!data?.token) {
    throw new Error("Invalid or expired login link");
  }
  return data;
}

/**
 * POST /api/auth/forgot-password — body: { email }
 */
export async function forgotPasswordRequest(email) {
  const data = await postAuth("/auth/forgot-password", { email });
  if (!data?.resetToken) {
    throw new Error("Password reset could not be started");
  }
  return data;
}

/**
 * POST /api/auth/reset-password — body: { token, password, confirmPassword }
 */
export async function resetPasswordRequest(body) {
  return (await postAuth("/auth/reset-password", body)) ?? {};
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
