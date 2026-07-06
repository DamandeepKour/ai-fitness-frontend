import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function NotificationPreferenceRow({
  title,
  description,
  icon,
  checked,
  onCheckedChange,
  showDivider = true,
  disabled = false,
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-4",
        showDivider && "border-b border-border/60",
      )}
    >
      <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}
