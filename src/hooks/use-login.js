import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginRequestByType } from "@/api/auth";
import { persistAuth } from "@/lib/auth-token";

function formatLoginError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Login failed. Please try again."
  );
}

export function useLogin(options = {}) {
  const { userType = "user", defaultRedirect } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      setError("");
      try {
        const data = await loginRequestByType({ email, password }, userType);
        persistAuth({ token: data.token, user: data.user });
        const from = location.state?.from?.pathname || defaultRedirect || "/dashboard";
        navigate(from, { replace: true });
        return { ok: true };
      } catch (err) {
        setError(formatLoginError(err));
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [defaultRedirect, location, navigate, userType],
  );

  const clearError = useCallback(() => setError(""), []);

  return { login, loading, error, clearError };
}
