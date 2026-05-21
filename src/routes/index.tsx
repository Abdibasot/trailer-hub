import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div
        className="hidden lg:flex flex-col justify-between p-12 text-sidebar-foreground relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Truck className="h-6 w-6 text-accent-foreground" />
          </div>
          <span className="font-display text-xl tracking-wide">AMA TRAILERS</span>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-6xl xl:text-7xl leading-[0.95] text-white">
            AMA TRAILERS<br />MANAGEMENT<br />SYSTEM
          </h1>
          <p className="mt-6 text-white/70 max-w-md text-lg">
            Parking. Repairs. Trailer Building. One platform to run the yard.
          </p>
        </div>
        <div className="text-white/50 text-sm">© {new Date().getFullYear()} AMA Trailers Ltd.</div>
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <form className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="h-6 w-6 text-accent" />
            </div>
            <span className="font-display text-lg">AMA TRAILERS</span>
          </div>
          <div className="lg:hidden">
            <h1 className="font-display text-3xl">AMA TRAILERS MANAGEMENT SYSTEM</h1>
          </div>
          <div>
            <h2 className="font-display text-3xl">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to access the dashboard.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@amatrailers.co.ke" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-11" />
            </div>
          </div>
          <Button asChild className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <Link to="/dashboard">Sign in</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Authorized personnel only.
          </p>
        </form>
      </div>
    </div>
  );
}
