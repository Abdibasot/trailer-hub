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
import { Plus, Trash2, Car } from "lucide-react";

export const Route = createFileRoute("/dashboard/parking")({
  component: ParkingPage,
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

const fmt = (n: number) =>
  "Ksh " + n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  if (isNaN(d1) || isNaN(d2) || d2 < d1) return 0;
  return Math.max(1, Math.ceil((d2 - d1) / 86400000));
}

function ParkingPage() {
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

  const totalRevenue = rows.reduce(
    (s, r) => s + daysBetween(r.entry, r.exit) * r.rate,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Operations</div>
          <h1 className="font-display text-3xl sm:text-4xl mt-1 flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-primary text-accent inline-flex items-center justify-center">
              <Car className="h-5 w-5" />
            </span>
            Parking
          </h1>
          <p className="text-muted-foreground mt-1">Log every truck checking in and out of the yard.</p>
        </div>
        <div className="erp-card px-5 py-3">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
            Total Billed
          </div>
          <div className="font-display text-2xl">{fmt(totalRevenue)}</div>
        </div>
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle>New parking entry</CardTitle>
          <CardDescription>Fill in the truck's details to add it to the register.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Date of Entry">
              <Input type="date" value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} />
            </Field>
            <Field label="Date of Exit">
              <Input type="date" value={form.exit} onChange={(e) => setForm({ ...form, exit: e.target.value })} />
            </Field>
            <Field label="Rate / Day (Ksh)">
              <Input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: +e.target.value })} />
            </Field>
            <Field label="Truck Number">
              <Input placeholder="KCA 123A" value={form.truck} onChange={(e) => setForm({ ...form, truck: e.target.value })} />
            </Field>
            <Field label="Driver Name">
              <Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} />
            </Field>
            <Field label="Telephone">
              <Input placeholder="+254 …" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={add} className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6">
              <Plus className="h-4 w-4 mr-2" /> Add to register
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="erp-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Parking register</CardTitle>
            <CardDescription>Auto-calculates duration and total billed.</CardDescription>
          </div>
          <div className="text-xs text-muted-foreground">{rows.length} record{rows.length !== 1 && "s"}</div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="erp-table">
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
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                      No trucks parked yet.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => {
                  const days = daysBetween(r.entry, r.exit);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>{r.entry}</TableCell>
                      <TableCell className="font-semibold">{r.truck}</TableCell>
                      <TableCell>{r.driver}</TableCell>
                      <TableCell className="text-muted-foreground">{r.tel}</TableCell>
                      <TableCell>{r.exit || "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{days}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmt(r.rate)}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{fmt(days * r.rate)}</TableCell>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="erp-field-label">{label}</Label>
      {children}
    </div>
  );
}