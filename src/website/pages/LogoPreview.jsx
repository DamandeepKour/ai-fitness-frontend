import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BrandLogo, LOGO_VARIANTS } from "@/website/components/site/BrandLogo";

export default function LogoPreview() {
  useEffect(() => {
    document.title = "Logo options — FitnovaAI";
  }, []);

  return (
    <div className="px-4 md:px-8 py-16 md:py-24 max-w-5xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Brand</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
        Pick a FitnovaAI logo
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Three options matching your blue–violet site gradient. Reply with{" "}
        <strong>A</strong>, <strong>B</strong>, or <strong>C</strong> and we&apos;ll add it to the
        header and footer.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {(["a", "b", "c"]).map((key) => {
          const v = LOGO_VARIANTS[key];
          return (
            <div
              key={key}
              className="glass-card rounded-3xl p-6 flex flex-col items-center text-center gap-4"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Option {key.toUpperCase()}
              </span>
              <img
                src={v.src}
                alt={v.label}
                className="h-24 w-24 rounded-2xl shadow-xl"
              />
              <div>
                <p className="font-bold">{v.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
              <BrandLogo variant={key} asLink={false} />
              <p className="text-xs text-muted-foreground font-mono">{v.src}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 glass-card rounded-3xl p-6 space-y-4">
        <p className="text-sm font-semibold">Header preview (dark bar)</p>
        <div className="rounded-2xl border border-border bg-background/80 backdrop-blur px-4 py-3 flex flex-wrap gap-8 items-center justify-around">
          {(["a", "b", "c"]).map((key) => (
            <BrandLogo key={key} variant={key} to="/welcome" />
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link to="/welcome" className="text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
