import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import { useSignup } from "@/hooks/use-signup";
import { useAuthFieldValidation } from "@/hooks/use-auth-field-validation";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth-validation";
import { SIGNUP_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";
import { OutlinedField } from "@/components/auth/OutlinedField";
import { OutlinedPasswordField } from "@/components/auth/OutlinedPasswordField";

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

  const validators = useMemo(
    () => ({
      name: (v) => validateName(v),
      email: (v) => validateEmail(v),
      password: (v) => validatePassword(v),
      confirmPassword: (v, all) => validateConfirmPassword(all.password, v),
    }),
    [],
  );

  const { touch, validateField, validateAll, getError } = useAuthFieldValidation(validators);

  const slides = SIGNUP_MARKETING_SLIDES;
  const bgSources = slides.map((s) => s.src);
  const activeIndex = useRotatingIndex(slides.length, ROTATE_MS);

  const updateField = (field, value) => {
    clearError();
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (getError(field)) validateField(field, value, next);
      if (field === "password" && getError("confirmPassword")) {
        validateField("confirmPassword", next.confirmPassword, next);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!validateAll(form)) return;
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
              This page creates only superadmin accounts.
            </p>
            <div className="space-y-3">
              <OutlinedField
                label="Name"
                autoComplete="name"
                placeholder="Jane Smith"
                value={form.name}
                error={getError("name")}
                onChange={(e) => updateField("name", e.target.value)}
                onBlur={() => {
                  touch("name");
                  validateField("name", form.name, form);
                }}
              />
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
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                error={getError("password")}
                onChange={(e) => updateField("password", e.target.value)}
                onBlur={() => {
                  touch("password");
                  validateField("password", form.password, form);
                }}
              />
              <OutlinedPasswordField
                label="Confirm password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                error={getError("confirmPassword")}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                onBlur={() => {
                  touch("confirmPassword");
                  validateField("confirmPassword", form.confirmPassword, form);
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
