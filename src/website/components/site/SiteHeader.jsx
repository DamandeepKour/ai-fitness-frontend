import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/welcome", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/welcome" className="flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-base font-bold tracking-tight">FitnovaAI</p>
            <p className="text-[10px] text-muted-foreground">Train smart · Eat smart</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === l.to
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "var(--gradient-hero)" }}
          >
            Open App ✨
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border/60 px-4 py-3 flex flex-col gap-1 bg-background/95"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="mt-2 px-3 py-2 rounded-lg text-sm font-semibold text-white text-center"
            style={{ background: "var(--gradient-hero)" }}
          >
            Open App ✨
          </Link>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
