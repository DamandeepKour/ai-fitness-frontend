import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { googleAuthRequest } from "@/api/auth";
import { persistAuth } from "@/lib/auth-token";

function formatGoogleError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Google sign-in failed. Please try again."
  );
}

export function useGoogleAuth(options = {}) {
  const { defaultRedirect = "/dashboard" } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = useCallback(
    async (credential) => {
      if (!credential) {
        setError("Google sign-in was cancelled");
        return { ok: false };
      }

      setLoading(true);
      setError("");
      try {
        const data = await googleAuthRequest(credential);
        persistAuth({ token: data.token, user: data.user });
        const from = location.state?.from?.pathname || defaultRedirect;
        navigate(from, { replace: true });
        return { ok: true, isNewUser: data.isNewUser };
      } catch (err) {
        setError(formatGoogleError(err));
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [defaultRedirect, location, navigate],
  );

  const clearError = useCallback(() => setError(""), []);

  const onGoogleError = useCallback(() => {
    setError("Google sign-in was cancelled or failed");
  }, []);

  return { signInWithGoogle, loading, error, clearError, onGoogleError };
}
