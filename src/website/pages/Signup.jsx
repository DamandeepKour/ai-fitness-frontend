import { useState } from "react";
import { Link } from "react-router-dom";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useSignup } from "@/hooks/use-signup";
import { SIGNUP_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";

const ROTATE_MS = 2000;

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { signup, loading, error, clearError } = useSignup();

  const slides = SIGNUP_MARKETING_SLIDES;
  const bgSources = slides.map((s) => s.src);
  const activeIndex = useRotatingIndex(slides.length, ROTATE_MS);

  const handleSubmit = async () => {
    await signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
      <AuthAmbientBackdrop sources={bgSources} activeIndex={activeIndex} />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-[0_28px_90px_-20px_rgba(16,185,129,0.18),0_12px_40px_-15px_rgba(139,92,246,0.14)] backdrop-blur-xl dark:border-border/60 dark:bg-card/85 dark:shadow-[0_28px_80px_-24px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.06)] lg:grid-cols-2">
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-card via-card to-emerald-500/5 dark:to-emerald-500/10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-400/20 to-violet-500/15 blur-3xl dark:from-emerald-500/10 dark:to-violet-600/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-orange-400/15 to-rose-400/12 blur-3xl" />

          <div className="relative">
            <AuthMobileHeroStrip slides={slides} activeIndex={activeIndex} />

            <img
              src="/fitnova-logo-wide.png"
              alt="FitNova AI"
              className="h-24 mb-5 ring-primary/15 rounded-2xl w-full"
            />
            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-violet-600 dark:from-emerald-400 dark:to-violet-400 mb-2">
              Start your FitNova AI journey
            </p>
            <h2 className="mb-2 text-4xl font-semibold tracking-tight text-foreground">Create account</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Build better food and fitness habits with intelligent daily insights.
            </p>

            <div className="space-y-4">
              <input
                placeholder="Name"
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-input/80 bg-background/80 px-4 text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground backdrop-blur-sm transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                value={form.name}
                onChange={(e) => {
                  clearError();
                  setForm((f) => ({ ...f, name: e.target.value }));
                }}
              />
              <input
                placeholder="Email"
                type="email"
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-input/80 bg-background/80 px-4 text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground backdrop-blur-sm transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                value={form.email}
                onChange={(e) => {
                  clearError();
                  setForm((f) => ({ ...f, email: e.target.value }));
                }}
              />
              <input
                placeholder="Password"
                type="password"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-input/80 bg-background/80 px-4 text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground backdrop-blur-sm transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/25"
                value={form.password}
                onChange={(e) => {
                  clearError();
                  setForm((f) => ({ ...f, password: e.target.value }));
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-3 font-medium text-primary-foreground shadow-md shadow-primary/25 transition-[transform,box-shadow] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create Account"}
            </button>
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>

        <AuthMarketingPanel slides={slides} activeIndex={activeIndex} />
      </div>
    </div>
  );
};

export default Signup;
