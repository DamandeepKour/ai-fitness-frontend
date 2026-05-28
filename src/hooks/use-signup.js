import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signupRequestByType } from "@/api/auth";

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
    async ({ name, email, password }) => {
      setLoading(true);
      setError("");
      try {
        await signupRequestByType({ name, email, password }, userType);
        navigate(redirectTo || (userType === "superadmin" ? "/superadmin/login" : "/login"), { replace: false });
        return { ok: true };
      } catch (err) {
        setError(formatSignupError(err));
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [navigate, redirectTo, userType],
  );

  const clearError = useCallback(() => setError(""), []);

  return { signup, loading, error, clearError };
}
