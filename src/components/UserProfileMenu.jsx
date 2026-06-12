import { Link } from "react-router-dom";
import { Bell, ChevronDown, History, LogOut, Settings, Shield } from "lucide-react";
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
import { cn } from "@/lib/utils";

const profileItems = [
  { to: "/profile", label: "Profile setting", icon: Settings },
  { to: "/meal-history", label: "Meal history", icon: History },
  { to: "/notifications", label: "Notification", icon: Bell },
  { to: "/privacy", label: "Privacy", icon: Shield },
];

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserProfileMenu({ className, showName = true }) {
  const user = getStoredUser();
  const { logout } = useAuth();
  const initials = getInitials(user?.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className={cn(
            "flex items-center gap-2 rounded-full border border-border bg-card px-1 py-1 pr-2 shadow-sm transition-colors hover:bg-accent",
            className,
          )}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-sm font-semibold text-white">
            {initials}
          </span>
          {showName ? (
            <span className="hidden lg:inline max-w-32 truncate text-sm font-medium">
              {user?.name || "Profile"}
            </span>
          ) : null}
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
              <p className="truncate text-sm font-semibold">{user?.name || "FitNova user"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "Manage your account"}
              </p>
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {profileItems.map(({ to, label, icon: Icon }) => (
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
