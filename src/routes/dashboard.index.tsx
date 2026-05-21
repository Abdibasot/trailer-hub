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
import { Plus, Trash2, Car, Wrench, Receipt } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: OperationsPage,
});

type ParkingEntry = {
  id: string;
  entry: string;
  exit: string;
  truck: string;
  tel: string;
  driver: string;
  rate: number;
};

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

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  if (isNaN(d1) || isNaN(d2) || d2 < d1) return 0;
  return Math.max(1, Math.ceil((d2 - d1) / 86400000));
}

const fmt = (n: number) =>
  "Ksh " + n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

function OperationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Yard Operations</h1>
        <p className="text-muted-foreground mt-1">
          Track parking, repairs and the expenses tied to every truck.
        </p>
      </div>

      <StatsRow />

      <section className="space-y-4">
        <SectionTitle icon={<Car className="h-5 w-5" />} title="Parking" />
        <ParkingSection />
      </section>

      <section className="space-y-4">
        <SectionTitle icon={<Wrench className="h-5 w-5" />} title="Repair & Expenses" />
        <RepairSection />
      </section>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-md bg-primary text-accent flex items-center justify-center">
        {icon}
      </div>
      <h2 className="font-display text-2xl">{title}</h2>
    </div>
  );
}

function StatsRow() {
  const stats = [
    { label: "Trucks parked", value: "—", icon: Car },
    { label: "Repairs in progress", value: "—", icon: Wrench },
    { label: "Monthly revenue", value: "Ksh 0", icon: Receipt },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label} className="border-l-4 border-l-accent">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
              <div className="font-display text-2xl mt-1">{s.value}</div>
            </div>
            <s.icon className="h-8 w-8 text-muted-foreground/40" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ParkingSection() {
  const [rows, setRows] = useState<ParkingEntry[]>([]);
  const [form, setForm] = useState<ParkingEntry>({
    id: "",
    entry: "",
    exit: "",
    truck: "",
    tel: "",
    driver: "",
    rate: 500,
  });

  const add = () => {
    if (!form.truck || !form.entry) return;
    setRows((r) => [...r, { ...form, id: crypto.randomUUID() }]);
    setForm({ id: "", entry: "", exit: "", truck: "", tel: "", driver: "", rate: form.rate });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
          <CardDescription>Log a truck checking into the yard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field label="Date of Entry">
            <Input type="date" value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} />
          </Field>
          <Field label="Truck No.">
            <Input placeholder="KCA 123A" value={form.truck} onChange={(e) => setForm({ ...form, truck: e.target.value })} />
          </Field>
          <Field label="Tel No.">
            <Input placeholder="+254 …" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} />
          </Field>
          <Field label="Driver Name">
            <Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} />
          </Field>
          <Field label="Date of Exit">
            <Input type="date" value={form.exit} onChange={(e) => setForm({ ...form, exit: e.target.value })} />
          </Field>
          <Field label="Rate / day (Ksh)">
            <Input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: +e.target.value })} />
          </Field>
          <Button onClick={add} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Add to register
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parking register</CardTitle>
          <CardDescription>Auto-calculates duration and total.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry</TableHead>
                  <TableHead>Truck</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Tel</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                      No trucks parked yet.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => {
                  const days = daysBetween(r.entry, r.exit);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>{r.entry}</TableCell>
                      <TableCell className="font-medium">{r.truck}</TableCell>
                      <TableCell>{r.driver}</TableCell>
                      <TableCell>{r.tel}</TableCell>
                      <TableCell>{r.exit || "—"}</TableCell>
                      <TableCell className="text-right">{days}</TableCell>
                      <TableCell className="text-right">{fmt(r.rate)}</TableCell>
                      <TableCell className="text-right font-semibold">{fmt(days * r.rate)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setRows(rows.filter((x) => x.id !== r.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RepairSection() {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log a repair</CardTitle>
          <CardDescription>Each repair tracks its own expenses & profit.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <Field label="Number Plate">
            <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
          </Field>
          <Field label="Entry Date">
            <Input type="date" value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} />
          </Field>
          <Field label="Repair / Service">
            <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
          </Field>
          <Field label="Amount Charged (Ksh)">
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
          </Field>
          <div className="sm:col-span-4">
            <Button onClick={add} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Add repair job
            </Button>
          </div>
        </CardContent>
      </Card>

      {repairs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-display text-xl">{repair.plate}</CardTitle>
          <CardDescription>
            {repair.service || "—"} · Entry {repair.entry || "—"}
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Charged</div>
          <div className="font-display text-lg">{fmt(repair.amount)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESET_EXPENSES.map((p) => (
            <Button
              key={p}
              size="sm"
              variant="outline"
              onClick={() => {
                const v = prompt(`Amount for ${p} (Ksh)`);
                if (v) addExpense(p, +v);
              }}
            >
              + {p}
            </Button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Custom expense" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input type="number" placeholder="Amount" value={amount || ""} onChange={(e) => setAmount(+e.target.value)} />
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
            <Table>
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
                    <TableCell className="text-right">{fmt(e.amount)}</TableCell>
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

        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <Stat label="Charged" value={fmt(repair.amount)} />
          <Stat label="Expenses" value={fmt(totalExp)} />
          <Stat
            label="Profit"
            value={fmt(profit)}
            tone={profit >= 0 ? "good" : "bad"}
          />
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
    <div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}