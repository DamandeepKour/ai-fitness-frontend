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
  const [success, setSuccess] = useState(null);

  const signup = useCallback(
    async ({ name, email, password, phone }) => {
      setLoading(true);
      setError("");
      setSuccess(null);
      try {
        const result = await signupRequestByType(
          { name, email, password, phone },
          userType,
        );

        if (userType === "user") {
          setSuccess({
            email,
            emailSent: result.emailSent !== false,
            message:
              result.message ||
              "Account created. Check your email for a one-time login link.",
          });
          return { ok: true, emailSent: result.emailSent };
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
  const resetSuccess = useCallback(() => setSuccess(null), []);

  return { signup, loading, error, success, clearError, resetSuccess };
}
