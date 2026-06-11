import { cn } from "@/lib/utils";

export function OutlinedField({
  label,
  error,
  className,
  inputClassName,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  name,
  id,
}) {
  const hasError = Boolean(error);
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

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
            "absolute -top-2.5 left-3 px-1.5 text-xs font-medium leading-none",
            "bg-card text-foreground/90",
            hasError && "text-rose-400",
          )}
        >
          {label}
        </label>
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          className={cn(
            "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            hasError && "text-rose-400 placeholder:text-rose-400/50",
            inputClassName,
          )}
        />
      </div>
      {hasError ? (
        <p className="mt-1.5 text-xs text-rose-400 leading-snug">{error}</p>
      ) : null}
    </div>
  );
}
