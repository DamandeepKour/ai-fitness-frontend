import { GoogleLogin } from "@react-oauth/google";

export function isGoogleSignInEnabled() {
  return Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
}

export function GoogleSignInButton({ onSuccess, onError, disabled = false, text = "signup_with" }) {
  if (!isGoogleSignInEnabled()) {
    return null;
  }

  return (
    <div className={`flex justify-center ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        shape="pill"
        text={text}
        width="100%"
      />
    </div>
  );
}

export function AuthDivider({ label = "or" }) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/80" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-card px-3 text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
