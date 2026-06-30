import { useCallback, useRef, useState } from "react";
import { verifyEmailRequest } from "@/api/auth";
import { validateEmail } from "@/lib/auth-validation";

export function useEmailVerification() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [serverError, setServerError] = useState("");
  const lastChecked = useRef("");

  const reset = useCallback(() => {
    setVerified(false);
    setServerError("");
    lastChecked.current = "";
  }, []);

  const verifyEmail = useCallback(async (rawEmail) => {
    const email = String(rawEmail || "").trim().toLowerCase();
    const formatError = validateEmail(email);
    if (formatError) {
      setVerified(false);
      setServerError("");
      lastChecked.current = "";
      return { ok: false, message: formatError };
    }

    if (lastChecked.current === email && verified && !serverError) {
      return { ok: true };
    }

    setVerifying(true);
    setServerError("");
    try {
      await verifyEmailRequest(email);
      lastChecked.current = email;
      setVerified(true);
      return { ok: true };
    } catch (err) {
      lastChecked.current = email;
      setVerified(false);
      const message =
        err?.response?.data?.message || err?.message || "Could not verify this email";
      setServerError(message);
      return { ok: false, message };
    } finally {
      setVerifying(false);
    }
  }, [serverError, verified]);

  return {
    verifying,
    verified,
    serverError,
    verifyEmail,
    reset,
  };
}
