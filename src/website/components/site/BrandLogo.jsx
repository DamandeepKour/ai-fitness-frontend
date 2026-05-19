import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/** Logo mark variants — pick one: "a" | "b" | "c" */
export const LOGO_VARIANTS = {
  a: { src: "/logos/fitnova-logo-a.svg", label: "Nova Pulse", desc: "Star burst + heartbeat — AI + fitness energy" },
  b: { src: "/logos/fitnova-logo-b.svg", label: "Neural F", desc: "F monogram + AI nodes — tech & personal coaching" },
  c: { src: "/logos/fitnova-logo-c.svg", label: "Orbit Lift", desc: "Dumbbell in orbit ring — strength & progress" },
};

export function BrandLogo({
  variant = "a",
  showText = true,
  tagline = "Train smart · Eat smart",
  className,
  iconClassName = "h-9 w-9",
  to = "/welcome",
  asLink = true,
}) {
  const { src } = LOGO_VARIANTS[variant] ?? LOGO_VARIANTS.a;

  const content = (
    <>
      <img
        src={src}
        alt="FitnovaAI"
        className={cn("rounded-xl shadow-lg object-cover shrink-0", iconClassName)}
      />
      {showText ? (
        <div className="leading-none">
          <p className="text-base font-bold tracking-tight">FitnovaAI</p>
          {tagline ? (
            <p className="text-[10px] text-muted-foreground">{tagline}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (!asLink) {
    return <div className={cn("flex items-center gap-2", className)}>{content}</div>;
  }

  return (
    <Link to={to} className={cn("flex items-center gap-2", className)}>
      {content}
    </Link>
  );
}
