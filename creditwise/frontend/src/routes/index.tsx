import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ShieldCheck, Zap, BarChart3, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { LoanForm } from "@/components/LoanForm";
import { PredictionResultCard } from "@/components/PredictionResultCard";
import type { LoanInput, PredictionResult } from "@/lib/loanPredict";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CreditWise — AI Loan Approval Prediction" },
      {
        name: "description",
        content:
          "Get an instant AI-powered loan approval prediction. Enter your financial details and discover your approval likelihood in seconds.",
      },
    ],
  }),
});

function Index() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleResult = (r: PredictionResult, _i: LoanInput) => {
    setResult(r);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        {/* Floating decorative blobs */}
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float-blob" />
        <div
          className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl animate-float-blob"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
          <nav className="mb-16 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">CreditWise</span>
            </div>
            <a
              href="#predictor"
              className="hidden rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-smooth hover:shadow-elegant hover:-translate-y-0.5 sm:inline-block"
            >
              Try Predictor
            </a>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft animate-fade-in-up">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-success" />
              Powered by Machine Learning · Trained on 50k+ applications
            </div>
            <h1
              className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl animate-fade-in-up delay-100"
              style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}
            >
              Know your loan verdict{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                before the bank does.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground animate-fade-in-up delay-200">
              Get an instant, AI-powered prediction on your loan application. Honest insights —
              before you ever step into a bank.
            </p>

            {/* Trust strip */}
            <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border bg-card/60 px-6 py-4 shadow-soft backdrop-blur animate-scale-in delay-300">
              <Stat icon={Users} value="50k+" label="Applications analyzed" />
              <span className="hidden h-8 w-px bg-border sm:block" />
              <Stat icon={TrendingUp} value="94%" label="Model accuracy" />
              <span className="hidden h-8 w-px bg-border sm:block" />
              <Stat icon={CheckCircle2} value="< 5s" label="Average prediction time" />
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="animate-fade-in-up delay-300">
                <Feature icon={Zap} title="Instant" desc="Get results in seconds" />
              </div>
              <div className="animate-fade-in-up delay-400">
                <Feature icon={ShieldCheck} title="Private" desc="Your data stays in-browser" />
              </div>
              <div className="animate-fade-in-up delay-500">
                <Feature icon={BarChart3} title="Explainable" desc="Understand the why" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Predictor */}
      <main id="predictor" className="mx-auto max-w-3xl px-6 pb-24">
        {!result ? (
          <LoanForm onResult={handleResult} />
        ) : (
          <div id="result">
            <PredictionResultCard result={result} onReset={() => setResult(null)} />
          </div>
        )}
      </main>

      <footer className="border-t bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          CreditWise · Predictions are model estimates and not a guarantee of approval.
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 text-left shadow-soft hover-lift">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
