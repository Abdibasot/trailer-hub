import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Wrench } from "lucide-react";

export const Route = createFileRoute("/dashboard/repair")({
  component: RepairPage,
});

type ExpenseLine = { id: string; label: string; amount: number };
type RepairEntry = {
  id: string;
  plate: string;
  entry: string;
  service: string;
  amount: number;
  expenses: ExpenseLine[];
};

const PRESET_EXPENSES = ["CO2", "O2", "Mid-wire", "Labour", "ROD", "Cutting disk", "Grinding disk"];

const fmt = (n: number) =>
  "Ksh " + n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

function RepairPage() {
  const [repairs, setRepairs] = useState<RepairEntry[]>([]);
  const [form, setForm] = useState<Omit<RepairEntry, "id" | "expenses">>({
    plate: "",
    entry: "",
    service: "",
    amount: 0,
  });

  const add = () => {
    if (!form.plate) return;
    setRepairs((r) => [...r, { ...form, id: crypto.randomUUID(), expenses: [] }]);
    setForm({ plate: "", entry: "", service: "", amount: 0 });
  };

  const totalCharged = repairs.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = repairs.reduce(
    (s, r) => s + r.expenses.reduce((a, e) => a + e.amount, 0),
    0,
  );
  const profit = totalCharged - totalExpenses;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Operations</div>
          <h1 className="font-display text-3xl sm:text-4xl mt-1 flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-primary text-accent inline-flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </span>
            Repair & Expense
          </h1>
          <p className="text-muted-foreground mt-1">Log repair jobs and the expenses tied to each truck.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <SummaryPill label="Charged" value={fmt(totalCharged)} />
          <SummaryPill label="Expenses" value={fmt(totalExpenses)} />
          <SummaryPill label="Profit" value={fmt(profit)} tone={profit >= 0 ? "good" : "bad"} />
        </div>
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Log a repair job</CardTitle>
          <CardDescription>Each repair tracks its own expenses & profit.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Number Plate">
              <Input placeholder="KCA 123A" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
            </Field>
            <Field label="Entry Date">
              <Input type="date" value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} />
            </Field>
            <Field label="Repair / Service">
              <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
            </Field>
            <Field label="Amount Charged (Ksh)">
              <Input type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={add} className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6">
              <Plus className="h-4 w-4 mr-2" /> Add repair job
            </Button>
          </div>
        </CardContent>
      </Card>

      {repairs.length === 0 ? (
        <Card className="erp-card">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Wrench className="h-10 w-10 mx-auto mb-3 opacity-30" />
            No repair jobs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {repairs.map((r) => (
            <RepairCard
              key={r.id}
              repair={r}
              onChange={(updated) => setRepairs((rs) => rs.map((x) => (x.id === r.id ? updated : x)))}
              onDelete={() => setRepairs((rs) => rs.filter((x) => x.id !== r.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RepairCard({
  repair,
  onChange,
  onDelete,
}: {
  repair: RepairEntry;
  onChange: (r: RepairEntry) => void;
  onDelete: () => void;
}) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const totalExp = repair.expenses.reduce((s, e) => s + e.amount, 0);
  const profit = repair.amount - totalExp;

  const addExpense = (lbl: string, amt: number) => {
    if (!lbl || !amt) return;
    onChange({
      ...repair,
      expenses: [...repair.expenses, { id: crypto.randomUUID(), label: lbl, amount: amt }],
    });
  };

  return (
    <Card className="erp-card border-l-4 border-l-accent">
      <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="font-display text-xl uppercase tracking-wide">{repair.plate}</CardTitle>
          <CardDescription>
            {repair.service || "—"} · Entry {repair.entry || "—"}
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Charged</div>
          <div className="font-display text-2xl">{fmt(repair.amount)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="erp-field-label mb-2">Quick add expense</div>
          <div className="flex flex-wrap gap-2">
            {PRESET_EXPENSES.map((p) => (
              <Button
                key={p}
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  const v = prompt(`Amount for ${p} (Ksh)`);
                  if (v) addExpense(p, +v);
                }}
              >
                + {p}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
          <Input placeholder="Custom expense" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input type="number" placeholder="Amount (Ksh)" value={amount || ""} onChange={(e) => setAmount(+e.target.value)} />
          <Button
            onClick={() => {
              addExpense(label, amount);
              setLabel("");
              setAmount(0);
            }}
          >
            Add
          </Button>
        </div>

        {repair.expenses.length > 0 && (
          <div className="rounded-md border overflow-hidden">
            <Table className="erp-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Expense</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {repair.expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{fmt(e.amount)}</TableCell>
                    <TableCell className="w-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onChange({ ...repair, expenses: repair.expenses.filter((x) => x.id !== e.id) })
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

        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <Stat label="Charged" value={fmt(repair.amount)} />
          <Stat label="Expenses" value={fmt(totalExp)} />
          <Stat label="Profit" value={fmt(profit)} tone={profit >= 0 ? "good" : "bad"} />
        </div>

        <div>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> Remove job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-md bg-muted/40 p-3">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>
      <div
        className={
          "font-display text-lg mt-1 " +
          (tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-destructive" : "")
        }
      >
        {value}
      </div>
    </div>
  );
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="erp-card px-4 py-2.5 min-w-[120px]">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>
      <div
        className={
          "font-display text-base " +
          (tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-destructive" : "")
        }
      >
        {value}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="erp-field-label">{label}</Label>
      {children}
    </div>
  );
}