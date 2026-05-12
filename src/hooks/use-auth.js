import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "@/lib/auth-token";
import { logoutRequest } from "@/api/auth";

export function useAuth() {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Still clear local session if server rejects or network fails
    }
    clearAuth();
    navigate("/login", { replace: true });
  }, [navigate]);

  return { logout };
}
