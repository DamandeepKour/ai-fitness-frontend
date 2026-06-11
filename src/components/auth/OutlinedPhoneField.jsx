import PhoneInput from "react-phone-number-input";
import { cn } from "@/lib/utils";

export function OutlinedPhoneField({
  label = "Phone number",
  error,
  className,
  value,
  onChange,
  onBlur,
  defaultCountry = "IN",
  placeholder = "123-456-7890",
}) {
  const hasError = Boolean(error);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative rounded-lg border px-3.5 mb-5 p-2 transition-colors",
          "bg-background/40 dark:bg-background/20",
          hasError
            ? "border-rose-400/90 focus-within:border-rose-400"
            : "border-border/70 focus-within:border-primary/70",
        )}
      >
        <span
          className={cn(
            "absolute -top-2.5 left-3 px-1.5 text-xs font-medium leading-none bg-card",
            hasError ? "text-rose-400" : "text-foreground/90",
          )}
        >
          {label}
        </span>
        <PhoneInput
          international
          defaultCountry={defaultCountry}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "outlined-phone-input flex items-center gap-2",
            hasError && "outlined-phone-input--error",
          )}
        />
      </div>
      {hasError ? (
        <p className="mt-1.5 text-xs text-rose-400 leading-snug">{error}</p>
      ) : null}
    </div>
  );
}
