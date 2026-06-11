import { useState } from "react";
import { Link } from "react-router-dom";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useSignup } from "@/hooks/use-signup";
import { SIGNUP_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";
import { Mail, CheckCircle2 } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { PasswordField } from "@/components/auth/PasswordField";

const ROTATE_MS = 2000;

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading, error, success, clearError } = useSignup();
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
      phone: form.phone.trim(),
      password: form.password,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-5">
      <AuthAmbientBackdrop
        sources={bgSources}
        activeIndex={activeIndex}
      />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-[0_28px_90px_-20px_rgba(16,185,129,0.18),0_12px_40px_-15px_rgba(139,92,246,0.14)] backdrop-blur-xl lg:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="relative p-6 md:p-8 bg-gradient-to-br from-card via-card to-emerald-500/5">
          
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-400/20 to-violet-500/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-orange-400/15 to-rose-400/12 blur-3xl" />

          <div className="relative">
            
            <AuthMobileHeroStrip
              slides={slides}
              activeIndex={activeIndex}
            />

            <FitnovaAuthLogo className="mb-4 justify-center scale-90" />

            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-violet-600 mb-1">
              Start your FitNova AI journey
            </p>

            <h2 className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
              {success ? "Check your email" : "Create account"}
            </h2>

            {success ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-900">Account created!</p>
                    <p className="text-sm text-emerald-800/90 mt-1 leading-relaxed">
                      {success.message}
                    </p>
                    <p className="text-sm text-emerald-800/80 mt-3 inline-flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span>{success.email}</span>
                    </p>
                    {!success.emailSent ? (
                      <p className="text-xs text-amber-700 mt-3">
                        Email could not be sent (SMTP not configured). Use password login or check server logs for the link.
                      </p>
                    ) : null}
                    <Link
                      to="/login"
                      className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      Or log in with password →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Build better food and fitness habits with intelligent daily insights.
            </p>

            <div className="space-y-3">
              
              {/* Name */}
              <input
                placeholder="Name"
                autoComplete="name"
                className="h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground backdrop-blur-sm transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                value={form.name}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                  }));
                }}
              />

              {/* Email */}
              <input
                placeholder="Email"
                type="email"
                autoComplete="email"
                className="h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground backdrop-blur-sm transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                value={form.email}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({
                    ...f,
                    email: e.target.value,
                  }));
                }}
              />

              {/* Phone */}
              <div className="w-full">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={form.phone}
                  onChange={(phone) => {
                    clearError();
                    setLocalError("");

                    setForm((f) => ({
                      ...f,
                      phone: phone || "",
                    }));
                  }}
                  className="flex h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm text-foreground"
                />
              </div>

              {/* Password */}
              <PasswordField
                placeholder="Password"
                autoComplete="new-password"
                inputClassName="h-10 text-sm pl-3"
                value={form.password}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({ ...f, password: e.target.value }));
                }}
              />

              {/* Confirm Password */}
              <PasswordField
                placeholder="Confirm Password"
                autoComplete="new-password"
                inputClassName="h-10 text-sm pl-3"
                value={form.confirmPassword}
                onChange={(e) => {
                  clearError();
                  setLocalError("");
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }));
                }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create Account"}
            </button>

            {/* ERRORS */}
            {localError ? (
              <p className="mt-2 text-sm text-destructive">
                {localError}
              </p>
            ) : null}

            {error ? (
              <p className="mt-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {/* LOGIN */}
            <p className="mt-3 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login here
              </Link>
            </p>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <AuthMarketingPanel
          slides={slides}
          activeIndex={activeIndex}
        />
      </div>
    </div>
  );
};

export default Signup;