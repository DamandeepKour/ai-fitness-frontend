import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signupRequestByType } from "@/api/auth";
import { persistAuth } from "@/lib/auth-token";

function formatSignupError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Signup failed. Please try again."
  );
}

export function useSignup(options = {}) {
  const { userType = "user", redirectTo } = options;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = useCallback(
    async ({ name, email, password, phone }) => {
      setLoading(true);
      setError("");
      try {
        const result = await signupRequestByType(
          { name, email, password, phone: phone || undefined },
          userType,
        );

        if (userType === "user" && result.token) {
          persistAuth({ token: result.token, user: result.user });
          navigate(redirectTo || "/dashboard", { replace: true });
          return { ok: true };
        }

        if (redirectTo) {
          navigate(redirectTo, { replace: false });
        } else {
          navigate(userType === "superadmin" ? "/superadmin/login" : "/login", { replace: false });
        }
        return { ok: true };
      } catch (err) {
        setError(formatSignupError(err));
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [redirectTo, userType, navigate],
  );

  const clearError = useCallback(() => setError(""), []);

  return { signup, loading, error, clearError };
}
