import { Dumbbell } from "lucide-react";

export default function Loader({ text = "Loading dashboard..." }) {
  return (
    <div className="flex min-h-[55vh] w-full items-center justify-center">
      <div className="glass-card flex flex-col items-center gap-4 rounded-3xl px-8 py-7 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <Dumbbell className="absolute h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
