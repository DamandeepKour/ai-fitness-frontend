import { useState, useCallback } from "react";
import { submitContactRequest } from "@/api/contact";

function formatContactError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Could not send your message. Please try again."
  );
}

export function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = useCallback(async ({ name, email, message }) => {
    setLoading(true);
    setError("");
    try {
      await submitContactRequest({ name, email, message });
      setSent(true);
      return { ok: true };
    } catch (err) {
      setError(formatContactError(err));
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSent(false);
    setError("");
  }, []);

  return { submit, loading, error, sent, reset };
}
