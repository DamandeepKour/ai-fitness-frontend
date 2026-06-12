import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { forgotPasswordRequest, resetPasswordRequest } from "@/api/auth";
import { LOGIN_MARKETING_SLIDES } from "@/data/auth-visual-slides";
import { useRotatingIndex } from "@/hooks/use-rotating-index";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { AuthAmbientBackdrop } from "@/components/auth/AuthAmbientBackdrop";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { AuthMobileHeroStrip } from "@/components/auth/AuthMobileHeroStrip";
import { OutlinedField } from "@/components/auth/OutlinedField";
import { OutlinedPasswordField } from "@/components/auth/OutlinedPasswordField";
import { FitnovaAuthLogo } from "@/website/components/site/BrandLogo";

const ROTATE_MS = 2000;

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") || "";
  const [step, setStep] = useState(initialToken ? "password" : "email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const slides = LOGIN_MARKETING_SLIDES;
  const bgSources = slides.map((s) => s.src);
  const activeIndex = useRotatingIndex(slides.length, ROTATE_MS);

  useEffect(() => {
    document.title = "Forgot Password - FitNova AI";
  }, []);

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

  const handleVerifyEmail = async () => {
    const emailError = validateEmail(email);
    setErrors({ email: emailError });
    if (emailError) return;

    setLoading(true);
    setMessage("");
    try {
      const data = await forgotPasswordRequest(email.trim());
      setResetToken(data.resetToken);
      setStep("password");
      setMessage(data.message || "Email verified. Enter a new password.");
      setErrors({});
    } catch (err) {
      setErrors({
        email: getErrorMessage(err, "No account found with this email"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const nextErrors = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(nextErrors);
    if (nextErrors.password || nextErrors.confirmPassword) return;

    setLoading(true);
    setMessage("");
    try {
      const data = await resetPasswordRequest({
        token: resetToken,
        password,
        confirmPassword,
      });
      setStep("success");
      setMessage(data.message || "Password reset successfully. You can log in now.");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      setErrors({
        form: getErrorMessage(err, "Password reset failed. Please request a new link."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
      <AuthAmbientBackdrop sources={bgSources} activeIndex={activeIndex} />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-[0_28px_90px_-20px_rgba(59,130,246,0.2),0_12px_40px_-15px_rgba(236,72,153,0.12)] backdrop-blur-xl dark:border-border/60 dark:bg-card/85 lg:grid-cols-2">
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="relative">
            <AuthMobileHeroStrip slides={slides} activeIndex={activeIndex} />

            <FitnovaAuthLogo className="mb-6 justify-center" />
            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-violet-600 mb-2">
              Account recovery
            </p>
            <h2 className="mb-2 text-4xl font-semibold tracking-tight text-foreground">
              Forgot password
            </h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Verify your email, then create a new password for your FitNova AI account.
            </p>

            {step === "email" ? (
              <>
                <OutlinedField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  error={errors.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  onBlur={() => setErrors({ email: validateEmail(email) })}
                />

                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-3 font-medium text-primary-foreground shadow-md shadow-primary/25 transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify email"}
                </button>
              </>
            ) : null}

            {step === "password" ? (
              <>
                {message ? <p className="mb-5 text-sm text-emerald-500">{message}</p> : null}
                <div className="space-y-4">
                  <OutlinedPasswordField
                    label="New password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={password}
                    error={errors.password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: "", form: "" }));
                    }}
                    onBlur={() =>
                      setErrors((prev) => ({ ...prev, password: validatePassword(password) }))
                    }
                  />
                  <OutlinedPasswordField
                    label="Confirm password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    error={errors.confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "", form: "" }));
                    }}
                    onBlur={() =>
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: validateConfirmPassword(password, confirmPassword),
                      }))
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-3 font-medium text-primary-foreground shadow-md shadow-primary/25 transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
                {errors.form ? <p className="mt-3 text-sm text-destructive">{errors.form}</p> : null}
              </>
            ) : null}

            {step === "success" ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">Password updated</h3>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                <Link
                  to="/login"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Back to login
                </Link>
              </div>
            ) : null}

            {step !== "success" ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Login
                </Link>
              </p>
            ) : null}
          </div>
        </div>

        <AuthMarketingPanel slides={slides} activeIndex={activeIndex} />
      </div>
    </div>
  );
}
