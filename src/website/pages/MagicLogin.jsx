import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { magicLoginRequest } from "@/api/auth";
import { persistAuth } from "@/lib/auth-token";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function MagicLoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Signing in — FitNova AI";

    if (!token) {
      setStatus("error");
      setMessage("Missing login link. Request a new one from signup or use password login.");
      return;
    }

    let ignore = false;

    async function verify() {
      try {
        const data = await magicLoginRequest(token);
        if (ignore) return;
        persistAuth({ token: data.token, user: data.user });
        setStatus("success");
        setMessage("You're signed in. Redirecting to your dashboard…");
        setTimeout(() => {
          if (!ignore) navigate("/dashboard", { replace: true });
        }, 1200);
      } catch (err) {
        if (ignore) return;
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            err?.message ||
            "This login link is invalid or has expired.",
        );
      }
    }

    verify();
    return () => {
      ignore = true;
    };
  }, [token, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AuthAmbientBackdrop sources={[]} activeIndex={0} />

      <Card className="relative z-10 w-full max-w-md rounded-3xl border-0 p-8 text-center shadow-xl">
        <FitnovaAuthLogo className="justify-center scale-90 mb-6" />

        {status === "loading" ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <h1 className="text-xl font-semibold mt-4">Signing you in…</h1>
            <p className="text-sm text-muted-foreground mt-2">Verifying your secure login link.</p>
          </>
        ) : null}

        {status === "success" ? (
          <>
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <h1 className="text-xl font-semibold mt-4">Welcome back!</h1>
            <p className="text-sm text-muted-foreground mt-2">{message}</p>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <XCircle className="h-10 w-10 text-destructive mx-auto" />
            <h1 className="text-xl font-semibold mt-4">Link expired or invalid</h1>
            <p className="text-sm text-muted-foreground mt-2">{message}</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild className="rounded-xl">
                <Link to="/login">Log in with password</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/signup">Create a new account</Link>
              </Button>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
