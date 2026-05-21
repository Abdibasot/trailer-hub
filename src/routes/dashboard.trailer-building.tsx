import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Hammer } from "lucide-react";

export const Route = createFileRoute("/dashboard/trailer-building")({
  component: TrailerBuildingPage,
});

const TRAILER_TYPES = ["Monoblock", "Flatbed", "Skeletal", "Tipper", "Tanker", "Low-bed"];

type Material = { id: string; supplier: string; item: string; cost: number };
type Build = {
  id: string;
  type: string;
  number: number;
  budget: number;
  soldFor: number;
  materials: Material[];
};

const fmt = (n: number) =>
  "Ksh " + n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

function TrailerBuildingPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [type, setType] = useState(TRAILER_TYPES[0]);
  const [budget, setBudget] = useState(3_000_000);

  const startBuild = () => {
    const nextNumber = builds.filter((b) => b.type === type).length + 1;
    setBuilds((b) => [
      ...b,
      {
        id: crypto.randomUUID(),
        type,
        number: nextNumber,
        budget,
        soldFor: 0,
        materials: [],
      },
    ]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Trailer Building</h1>
        <p className="text-muted-foreground mt-1">
          Track every build from raw materials to sale.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start a new build</CardTitle>
          <CardDescription>Pick the type and set the budget.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Trailer type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRAILER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Budget (Ksh)</Label>
            <Input type="number" value={budget} onChange={(e) => setBudget(+e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={startBuild} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Start build
            </Button>
          </div>
        </CardContent>
      </Card>

      {builds.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Hammer className="h-10 w-10 mx-auto mb-3 opacity-30" />
            No builds in progress.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {builds.map((b) => (
            <BuildCard
              key={b.id}
              build={b}
              onChange={(u) => setBuilds((bs) => bs.map((x) => (x.id === b.id ? u : x)))}
              onDelete={() => setBuilds((bs) => bs.filter((x) => x.id !== b.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BuildCard({
  build,
  onChange,
  onDelete,
}: {
  build: Build;
  onChange: (b: Build) => void;
  onDelete: () => void;
}) {
  const [supplier, setSupplier] = useState("");
  const [item, setItem] = useState("");
  const [cost, setCost] = useState<number>(0);

  const spent = build.materials.reduce((s, m) => s + m.cost, 0);
  const remaining = build.budget - spent;
  const profit = build.soldFor - spent;
  const name = `${build.type} ${build.number}`;

  const addMaterial = () => {
    if (!supplier || !item || !cost) return;
    onChange({
      ...build,
      materials: [...build.materials, { id: crypto.randomUUID(), supplier, item, cost }],
    });
    setSupplier("");
    setItem("");
    setCost(0);
  };

  return (
    <Card className="border-l-4 border-l-accent">
      <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="font-display text-2xl uppercase tracking-wide">{name}</CardTitle>
          <CardDescription>Budget {fmt(build.budget)}</CardDescription>
        </div>
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sold for</Label>
            <Input
              type="number"
              className="w-40"
              value={build.soldFor || ""}
              onChange={(e) => onChange({ ...build, soldFor: +e.target.value })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Budget" value={fmt(build.budget)} />
          <Stat label="Spent" value={fmt(spent)} />
          <Stat
            label="Remaining"
            value={fmt(remaining)}
            tone={remaining < 0 ? "bad" : undefined}
          />
          <Stat
            label="Profit"
            value={fmt(profit)}
            tone={profit >= 0 ? "good" : "bad"}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_150px_auto]">
          <Input placeholder="Supplier / Company" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          <Input placeholder="Raw material" value={item} onChange={(e) => setItem(e.target.value)} />
          <Input type="number" placeholder="Cost (Ksh)" value={cost || ""} onChange={(e) => setCost(+e.target.value)} />
          <Button onClick={addMaterial}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>

        {build.materials.length > 0 && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Raw material</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {build.materials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.supplier}</TableCell>
                    <TableCell>{m.item}</TableCell>
                    <TableCell className="text-right">{fmt(m.cost)}</TableCell>
                    <TableCell className="w-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onChange({ ...build, materials: build.materials.filter((x) => x.id !== m.id) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> Remove build
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-md bg-muted/40 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={
          "font-display text-lg " +
          (tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-destructive" : "")
        }
      >
        {value}
      </div>
    </div>
  );
}