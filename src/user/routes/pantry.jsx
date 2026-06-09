import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPantryItemRequest, getPantryItemsRequest, removePantryItemRequest } from "@/api/pantry";
import { ChevronLeft, Plus, Trash2, Warehouse } from "lucide-react";

const SUGGESTIONS = ["Dal", "Rice", "Roti atta", "Paneer", "Onion", "Tomato", "Potato", "Eggs", "Oats", "Curd", "Soya chunks", "Poha"];

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPantryItemsRequest();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Pantry Mode — AIFitnova";
    load();
  }, [load]);

  async function handleAdd(name) {
    const value = (name || ingredient).trim();
    if (!value) return;
    setSaving(true);
    try {
      await addPantryItemRequest({ ingredient: value });
      setIngredient("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id) {
    await removePantryItemRequest(id);
    await load();
  }

  return (
    <AppShell>
      <header className="mb-8">
        <Button variant="ghost" size="sm" className="-ml-2 mb-3" asChild>
          <Link to="/smart" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            Smart features
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          <Warehouse className="h-3.5 w-3.5" />
          Pantry mode
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">What's in your kitchen?</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl">
          Add ingredients you have at home. Enable pantry mode on Generate to build meals only from these items.
        </p>
      </header>

      <Card className="glass-card rounded-3xl p-6 border-0 mb-6">
        <div className="flex gap-2">
          <Input
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="e.g. Rajma, Ragi flour..."
            className="h-11 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button type="button" className="rounded-xl shrink-0" disabled={saving} onClick={() => handleAdd()}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleAdd(s)}
              className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent"
            >
              + {s}
            </button>
          ))}
        </div>
      </Card>

      <Card className="glass-card rounded-3xl p-6 border-0">
        <h2 className="font-semibold mb-4">Your pantry ({items.length})</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items yet. Add staples above.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl bg-accent/40 px-4 py-3">
                <span className="font-medium">{item.ingredient}</span>
                <button type="button" onClick={() => handleRemove(item.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button className="w-full mt-6 rounded-xl" asChild>
          <Link to="/generate">Generate with pantry mode →</Link>
        </Button>
      </Card>
    </AppShell>
  );
}
