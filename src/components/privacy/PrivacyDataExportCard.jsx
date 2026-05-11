import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function PrivacyDataExportCard({ onDownload }) {
  return (
    <Card className="glass-card rounded-3xl border-0 p-6 mb-5">
      <h3 className="font-semibold mb-1">Your data</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Export a copy of everything Vital has stored about you.
      </p>
      <Button type="button" variant="secondary" className="rounded-full" onClick={onDownload}>
        <Download className="h-4 w-4" />
        Download my data
      </Button>
    </Card>
  );
}
