import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const LOGO = {
  mark: "/logos/fitnova-logo-light.png",
  full: "/logos/fitnova-logo-dark.png",
  wide: "/logos/fitnova-logo-dark.png",
};

export function BrandLogo({
  variant = "header",
  showText = true,
  className,
  iconClassName,
  to = "/welcome",
  asLink = true,
  size = "default",
}) {
  const isFooter = size === "footer";
  const isAuth = variant === "auth";

  let image;

  if (variant === "auth" || variant === "full") {
    image = (
      <img
        src={LOGO.full}
        alt="FitNova AI — Intelligent Fitness & Nutrition"
        className={cn(
          "object-contain shrink-0",
          isAuth ? "h-32 md:h-40 w-auto max-w-full" : "h-16 md:h-20 w-auto",
          iconClassName,
        )}
      />
    );
  } else if (variant === "wide" || (showText && variant === "header")) {
    image = (
      <img
        src={LOGO.wide}
        alt="FitNova AI"
        className={cn(
          "object-contain shrink-0",
          isFooter ? "h-16 w-auto max-w-[220px]" : "h-12 w-auto max-w-[190px]",
          iconClassName,
        )}
      />
    );
  } else {
    image = (
      <img
        src={LOGO.mark}
        alt="FitNova AI"
        className={cn("object-contain shrink-0 h-10 w-10", iconClassName)}
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