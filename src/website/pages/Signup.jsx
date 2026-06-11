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
  validatePhone,
} from "@/lib/auth-validation";
import { SIGNUP_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";
import { Mail, CheckCircle2 } from "lucide-react";
import { OutlinedField } from "@/components/auth/OutlinedField";
import { OutlinedPasswordField } from "@/components/auth/OutlinedPasswordField";
import { OutlinedPhoneField } from "@/components/auth/OutlinedPhoneField";

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

  const validators = useMemo(
    () => ({
      name: (v) => validateName(v),
      email: (v) => validateEmail(v),
      phone: (v) => validatePhone(v, { required: true }),
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
      phone: form.phone,
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
                placeholder="you@example.com"
                value={form.email}
                error={getError("email")}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => {
                  touch("email");
                  validateField("email", form.email, form);
                }}
              />

              <OutlinedPhoneField
                label="Phone number"
                defaultCountry="IN"
                placeholder="123-456-7890"
                value={form.phone}
                error={getError("phone")}
                onChange={(phone) => updateField("phone", phone || "")}
                onBlur={() => {
                  touch("phone");
                  validateField("phone", form.phone, form);
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

            {/* BUTTON */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create Account"}
            </button>

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