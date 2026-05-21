import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileBarChart2, Download, FileSpreadsheet, FileText, Printer } from "lucide-react";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

const REPORT_TYPES = [
  { id: "parking", label: "Parking register" },
  { id: "repairs", label: "Repairs & expenses" },
  { id: "builds", label: "Trailer builds" },
  { id: "profit", label: "Profit & loss summary" },
];

function ReportsPage() {
  const [type, setType] = useState(REPORT_TYPES[0].id);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reporting</div>
        <h1 className="font-display text-3xl sm:text-4xl mt-1 flex items-center gap-3">
          <span className="h-10 w-10 rounded-lg bg-primary text-accent inline-flex items-center justify-center">
            <FileBarChart2 className="h-5 w-5" />
          </span>
          Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate operational and financial reports across the yard.
        </p>
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Generate a report</CardTitle>
          <CardDescription>Pick a report type and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Report type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="From">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="To">
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </Field>
            <div className="flex items-end">
              <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" /> Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <ExportCard icon={FileSpreadsheet} title="Export to Excel" desc="Download the latest dataset as .xlsx" />
        <ExportCard icon={FileText} title="Export to PDF" desc="Print-ready summary report" />
        <ExportCard icon={Printer} title="Print" desc="Send the current view to the printer" />
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Recent reports</CardTitle>
          <CardDescription>Reports you have generated recently.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
            No reports generated yet.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExportCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <button className="erp-card p-5 text-left hover:shadow-lg transition-all hover:-translate-y-0.5">
      <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent-foreground inline-flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-display text-lg mt-4">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </button>
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