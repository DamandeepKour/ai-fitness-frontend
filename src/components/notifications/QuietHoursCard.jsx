import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuietHoursCard({ title, description, actionLabel = "Edit schedule", onAction }) {
  return (
    <Card className="glass-card rounded-3xl border-0 p-6 mt-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button type="button" variant="secondary" className="rounded-full" onClick={onAction}>
        {actionLabel}
      </Button>
    </Card>
  );
}
