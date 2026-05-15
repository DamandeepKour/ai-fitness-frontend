import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SitePlaceholder({ title, description }) {
  return (
    <section className="max-w-2xl mx-auto px-4 md:px-8 py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link to="/welcome">Back home</Link>
        </Button>
        <Button asChild variant="secondary" className="rounded-full">
          <Link to="/signup">Get started</Link>
        </Button>
      </div>
    </section>
  );
}
