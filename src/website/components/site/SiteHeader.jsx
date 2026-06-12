import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, ChevronDown, History, LogOut, Menu, Settings, Shield, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStoredUser } from "@/lib/auth-token";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { to: "/welcome", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  // { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

const profileLinks = [
  { to: "/profile", label: "Profile setting", icon: Settings },
  { to: "/meal-history", label: "Meal history", icon: History },
  { to: "/notifications", label: "Notification", icon: Bell },
  { to: "/privacy", label: "Privacy", icon: Shield },
];

function WebsiteProfileMenu() {
  const user = getStoredUser();
  const { logout } = useAuth();
  const initials = user?.name
    ? user.name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 py-1 pl-1 pr-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          aria-label="Open profile menu"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-sm font-semibold text-white">
            {initials}
          </span>
          <span className="hidden lg:inline text-foreground">{user?.name || "Profile"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-sm font-semibold text-white">
              {initials}
            </span>
            <span className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name || "FitNova user"}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || "Welcome back"}</p>
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {profileLinks.map(({ to, label, icon: Icon }) => (
          <DropdownMenuItem key={to} asChild>
            <Link to={to} className="cursor-pointer">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <BrandLogo variant="wide" to="/welcome" />

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
            Login in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "var(--gradient-hero)" }}
          >
            Open App
          </Link>
          <WebsiteProfileMenu />
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
          <div className="mt-2 border-t border-border/60 pt-2">
            {profileLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
