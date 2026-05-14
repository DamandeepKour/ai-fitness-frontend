// src/pages/Login.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useLogin } from "@/hooks/use-login";
import { LOGIN_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";

const ROTATE_MS = 5500;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading, error, clearError } = useLogin();

  const slides = LOGIN_MARKETING_SLIDES;
  const bgSources = slides.map((s) => s.src);
  const activeIndex = useRotatingIndex(slides.length, ROTATE_MS);

  const handleSubmit = async () => {
    await login({ email: form.email.trim(), password: form.password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
      <AuthAmbientBackdrop sources={bgSources} activeIndex={activeIndex} />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-[0_28px_90px_-20px_rgba(59,130,246,0.2),0_12px_40px_-15px_rgba(236,72,153,0.12)] backdrop-blur-xl dark:border-border/60 dark:bg-card/85 dark:shadow-[0_28px_80px_-24px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.06)] lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="relative p-8 md:p-12 bg-gradient-to-br from-card via-card to-primary/5 dark:to-primary/[0.07]"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-sky-400/20 to-violet-500/15 blur-3xl dark:from-sky-500/10 dark:to-violet-600/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-rose-400/15 to-amber-400/10 blur-3xl" />

          <div className="relative">
            <AuthMobileHeroStrip slides={slides} activeIndex={activeIndex} />

            <img
              src="/fitnova-logo-wide.png"
              alt="FitNova AI"
              className="h-24 mb-5 ring-primary/15 rounded-2xl w-full"
            />
            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-violet-600 dark:from-sky-400 dark:to-violet-400 mb-2">
              Welcome back to FitNova AI
            </p>
            <h2 className="mb-2 text-4xl font-semibold tracking-tight text-foreground">Login to continue</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Intelligent fitness and nutrition tracking for your healthy progress every day.
            </p>

            <div className="space-y-4">
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
                autoComplete="current-password"
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
              {loading ? "Signing in…" : "Login"}
            </button>
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            <p className="mt-4 text-sm text-muted-foreground">
              New user?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </motion.div>

        <AuthMarketingPanel slides={slides} activeIndex={activeIndex} />
      </div>
    </div>
  );
};

export default Login;
