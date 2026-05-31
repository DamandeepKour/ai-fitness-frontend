import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStoredUser, updateStoredUser } from "@/lib/auth-token";
import { getProfileCompletion } from "@/lib/profile-completion";
import { getSuperadminMeRequest } from "@/api/user";
import { useAuth } from "@/hooks/use-auth";
import { Bell, ChevronDown, LogOut, User, UserCircle } from "lucide-react";

export default function AdminProfileMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth({ redirectTo: "/superadmin/login" });
  const [user, setUser] = useState(() => getStoredUser());
  const completion = getProfileCompletion(user);

  useEffect(() => {
    let ignore = false;

    async function refreshMe() {
      try {
        const me = await getSuperadminMeRequest();
        if (ignore || !me) return;
        updateStoredUser(me);
        setUser(me);
      } catch {
        // keep cached user
      }
    }

    refreshMe();
    return () => {
      ignore = true;
    };
  }, []);

  const initials = user?.name
    ? user.name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-1 pr-2 py-1 hover:bg-slate-50 transition-colors"
        >
          <span className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white text-sm font-semibold grid place-items-center">
            {initials}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold text-slate-900">{user?.name || "Super Admin"}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          <p className="text-xs text-orange-600 mt-1">Profile {completion.percent}% complete</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/superadmin/profile" className="cursor-pointer">
            <User className="h-4 w-4" />
            My profile
          </Link>
        </DropdownMenuItem>

        {!completion.isComplete ? (
          <DropdownMenuItem asChild>
            <Link to="/superadmin/profile?complete=1" className="cursor-pointer">
              <UserCircle className="h-4 w-4" />
              Complete profile
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem asChild>
          <Link to="/superadmin/notifications" className="cursor-pointer">
            <Bell className="h-4 w-4" />
            Notifications
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
