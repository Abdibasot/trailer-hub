import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Wrench, Hammer, TrendingUp, ArrowUpRight, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: SummaryDashboard,
});

const kpis = [
  { label: "Trucks Parked", value: "0", delta: "+0 today", icon: Car, tone: "primary" },
  { label: "Active Repairs", value: "0", delta: "0 pending", icon: Wrench, tone: "accent" },
  { label: "Builds In Progress", value: "0", delta: "0 ready", icon: Hammer, tone: "primary" },
  { label: "Monthly Revenue", value: "Ksh 0", delta: "+0%", icon: TrendingUp, tone: "accent" },
];

const shortcuts = [
  { to: "/dashboard/parking", title: "Parking", desc: "Check trucks in & out of the yard.", icon: Car },
  { to: "/dashboard/repair", title: "Repair & Expense", desc: "Track repair jobs and profitability.", icon: Wrench },
  { to: "/dashboard/trailer-building", title: "Trailer Building", desc: "Manage builds from raw materials to sale.", icon: Hammer },
  { to: "/dashboard/reports", title: "Reports", desc: "Generate operational and financial reports.", icon: Activity },
];

function SummaryDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Overview</div>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">Dashboard</h1>
          <p className="text-muted-foreground mt-1">A live snapshot of yard operations.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="erp-card overflow-hidden relative">
            <div
              className={
                "absolute inset-x-0 top-0 h-1 " +
                (k.tone === "accent" ? "bg-accent" : "bg-primary")
              }
            />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  {k.label}
                </div>
                <div
                  className={
                    "h-9 w-9 rounded-lg flex items-center justify-center " +
                    (k.tone === "accent"
                      ? "bg-accent/15 text-accent-foreground"
                      : "bg-primary/10 text-primary")
                  }
                >
                  <k.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="font-display text-3xl mt-3">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">Quick access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="erp-card group p-5 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div className="font-display text-lg">{s.title}</div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Recent activity</CardTitle>
          <CardDescription>Latest movements across the yard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
            No activity yet. As you log entries, they'll appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}