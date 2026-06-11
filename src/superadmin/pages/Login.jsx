import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useLogin } from "@/hooks/use-login";
import { useAuthFieldValidation } from "@/hooks/use-auth-field-validation";
import { validateEmail, validatePassword } from "@/lib/auth-validation";
import { LOGIN_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";
import { OutlinedField } from "@/components/auth/OutlinedField";
import { OutlinedPasswordField } from "@/components/auth/OutlinedPasswordField";

const ROTATE_MS = 2000;

export default function SuperAdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading, error, clearError } = useLogin({
    userType: "superadmin",
    defaultRedirect: "/superadmin",
  });

  const validators = useMemo(
    () => ({
      email: (v) => validateEmail(v),
      password: (v) => validatePassword(v),
    }),
    [],
  );

  const { touch, validateField, validateAll, getError } = useAuthFieldValidation(validators);

  const slides = LOGIN_MARKETING_SLIDES;
  const bgSources = slides.map((s) => s.src);
  const activeIndex = useRotatingIndex(slides.length, ROTATE_MS);

  const updateField = (field, value) => {
    clearError();
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (getError(field)) validateField(field, value, next);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!validateAll(form)) return;
    await login({ email: form.email.trim(), password: form.password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
      <AuthAmbientBackdrop sources={bgSources} activeIndex={activeIndex} />
      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl lg:grid-cols-2">
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="relative">
            <AuthMobileHeroStrip slides={slides} activeIndex={activeIndex} />
            <FitnovaAuthLogo className="mb-6 justify-center" />
            <p className="text-sm font-medium text-primary mb-2">Superadmin Access</p>
            <h2 className="mb-2 text-4xl font-semibold tracking-tight text-foreground">
              Superadmin Login
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Login with your superadmin credentials to manage users and operations.
            </p>
            <div className="space-y-4">
              <OutlinedField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={form.email}
                error={getError("email")}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => {
                  touch("email");
                  validateField("email", form.email, form);
                }}
              />
              <OutlinedPasswordField
                label="Password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                error={getError("password")}
                onChange={(e) => updateField("password", e.target.value)}
                onBlur={() => {
                  touch("password");
                  validateField("password", form.password, form);
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-3 font-medium text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login as Superadmin"}
            </button>
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            <p className="mt-4 text-sm text-muted-foreground">
              Need a superadmin account?{" "}
              <Link to="/superadmin/signup" className="font-medium text-primary hover:underline">
                Create superadmin
              </Link>
            </p>
          </div>
        </div>
        <AuthMarketingPanel slides={slides} activeIndex={activeIndex} />
      </div>
    </div>
  );
}
