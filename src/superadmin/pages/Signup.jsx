import { useState } from "react";
import { Link } from "react-router-dom";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useSignup } from "@/hooks/use-signup";
import { SIGNUP_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";

const ROTATE_MS = 2000;

export default function SuperAdminSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup, loading, error, clearError } = useSignup({
    userType: "superadmin",
    redirectTo: "/superadmin/login",
  });
  const [localError, setLocalError] = useState("");

  const slides = SIGNUP_MARKETING_SLIDES;
  const bgSources = slides.map((s) => s.src);
  const activeIndex = useRotatingIndex(slides.length, ROTATE_MS);

  const handleSubmit = async () => {
    setLocalError("");
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    await signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-5">
      <AuthAmbientBackdrop sources={bgSources} activeIndex={activeIndex} />
      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl lg:grid-cols-2">
        <div className="relative p-6 md:p-8 bg-gradient-to-br from-card via-card to-emerald-500/5">
          <div className="relative">
            <AuthMobileHeroStrip slides={slides} activeIndex={activeIndex} />
            <FitnovaAuthLogo className="mb-4 justify-center scale-90" />
            <p className="text-sm font-medium text-primary mb-1">Superadmin Access</p>
            <h2 className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
              Create Superadmin
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              This page creates only `superadmin` accounts.
            </p>
            <div className="space-y-3">
              <input
                placeholder="Name"
                className="h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm"
                value={form.name}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({ ...f, name: e.target.value }));
                }}
              />
              <input
                placeholder="Email"
                type="email"
                className="h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm"
                value={form.email}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({ ...f, email: e.target.value }));
                }}
              />
              <input
                placeholder="Password"
                type="password"
                className="h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm"
                value={form.password}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({ ...f, password: e.target.value }));
                }}
              />
              <input
                placeholder="Confirm Password"
                type="password"
                className="h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm"
                value={form.confirmPassword}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }));
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Superadmin"}
            </button>
            {localError ? <p className="mt-2 text-sm text-destructive">{localError}</p> : null}
            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
            <p className="mt-3 text-sm text-muted-foreground">
              Already have superadmin access?{" "}
              <Link to="/superadmin/login" className="font-medium text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
        <AuthMarketingPanel slides={slides} activeIndex={activeIndex} />
      </div>
    </div>
  );
}
