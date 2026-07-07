import { useState } from "react";
import { cn } from "@/lib/utils";
import { getDefaultProfileCover } from "@/lib/profile-cover";

export function ProfileCoverBackground({ user, className, children }) {
  const cover = getDefaultProfileCover(user);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!imageFailed ? (
        <img
          src={cover.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0",
          imageFailed
            ? "bg-gradient-to-br from-[#1e3a8a] via-[#312e81] to-[#15171f]"
            : "bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-[#15171f]/95",
        )}
      />

      <div className="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-primary/25 blur-2xl" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
