import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const LOGO = {
  mark: "/logos/fitnova-mark.svg",
  full: "/logos/fitnova-logo.svg",
  wide: "/logos/fitnova-logo-wide.svg",
};

export function BrandLogo({
  variant = "header",
  showText = true,
  tagline,
  className,
  iconClassName,
  to = "/welcome",
  asLink = true,
  size = "default",
}) {
  const isFooter = size === "footer";
  const isAuth = variant === "auth";

  let image = null;

  if (variant === "auth" || variant === "full") {
    image = (
      <img
        src={LOGO.full}
        alt="FitNova AI — Intelligent Fitness & Nutrition"
        className={cn(
          "object-contain shrink-0",
          isAuth ? "h-28 md:h-32 w-auto max-w-full" : "h-14 md:h-16 w-auto",
          iconClassName,
        )}
        style={{ filter: "saturate(1.25) contrast(1.08)" }}
      />
    );
  } else if (variant === "wide" || (showText && variant === "header")) {
    image = (
      <img
        src={LOGO.wide}
        alt="FitNova AI"
        className={cn(
          "object-contain shrink-0",
          isFooter ? "h-11 w-auto max-w-[200px]" : "h-9 w-auto max-w-[180px]",
          iconClassName,
        )}
        style={{ filter: "saturate(1.2) contrast(1.06)" }}
      />
    );
  } else {
    image = (
      <img
        src={LOGO.mark}
        alt="FitNova AI"
        className={cn("object-contain shrink-0 h-10 w-10", iconClassName)}
        style={{ filter: "saturate(1.15)" }}
      />
    );
  }

  const content = image;

  if (!asLink) {
    return <div className={cn("flex items-center", className)}>{content}</div>;
  }

  return (
    <Link to={to} className={cn("flex items-center", className)}>
      {content}
    </Link>
  );
}

/** Auth + marketing: full lockup SVG */
export function FitnovaAuthLogo({ className }) {
  return (
    <div className={cn("flex w-full", className)}>
      <BrandLogo variant="auth" asLink={false} />
    </div>
  );
}