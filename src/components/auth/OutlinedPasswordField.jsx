import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function OutlinedPasswordField({
  label = "Password",
  error,
  className,
  value,
  onChange,
  onBlur,
  placeholder = "••••••••",
  autoComplete = "current-password",
  name,
  id,
}) {
  const [visible, setVisible] = useState(false);
  const hasError = Boolean(error);
  const inputId = id || name || "password";

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative rounded-lg border px-3.5 p-2 mb-5 transition-colors",
          "bg-background/40 dark:bg-background/20",
          hasError
            ? "border-rose-400/90 focus-within:border-rose-400"
            : "border-border/70 focus-within:border-primary/70",
        )}
      >
        <label
          htmlFor={inputId}
          className={cn(
            "absolute -top-2.5 left-3 px-1.5 text-xs font-medium leading-none bg-card",
            hasError ? "text-rose-400" : "text-foreground/90",
          )}
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            name={name}
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={hasError}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
              hasError && "text-rose-400 placeholder:text-rose-400/50",
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {hasError ? (
        <p className="mt-1.5 text-xs text-rose-400 leading-snug">{error}</p>
      ) : null}
    </div>
  );
}
