import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordField({
  value,
  onChange,
  placeholder = "Password",
  autoComplete = "current-password",
  className,
  inputClassName,
  onFocus,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <input
        placeholder={placeholder}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className={cn(
          "h-12 w-full rounded-xl border border-input/80 bg-background/80 pl-4 pr-11 text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground backdrop-blur-sm transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/25",
          inputClassName,
        )}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
