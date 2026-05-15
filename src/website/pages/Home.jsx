import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-lg w-full rounded-3xl border-0 p-8 text-center shadow-lg">
        <img
          src="/fitnova-logo.png"
          alt="FitNova AI"
          className="h-16 w-16 rounded-2xl mx-auto object-cover ring-1 ring-border"
        />
        <h1 className="text-3xl font-semibold mt-6">FitNova AI</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Intelligent fitness and nutrition — track meals, hit goals, and stay consistent.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button asChild className="rounded-full">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/signup">Create account</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
