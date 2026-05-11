import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function PrivacyDeleteAccountCard({ onDelete }) {
  return (
    <Card className="glass-card rounded-3xl border-0 p-6 border border-destructive/20">
      <h3 className="font-semibold mb-1 text-destructive">Delete account</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Permanently remove your account and all associated data. This cannot be undone.
      </p>
      <Button type="button" variant="destructive" className="rounded-full" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete account
      </Button>
    </Card>
  );
}
