import { CheckCircle2, XCircle, TrendingUp, TrendingDown, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PredictionResult } from "@/lib/loanPredict";

interface Props {
  result: PredictionResult;
  onReset: () => void;
}

export function PredictionResultCard({ result, onReset }: Props) {
  const pct = Math.round(result.probability * 100);
  const approved = result.approved;

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl p-8 text-center shadow-elegant ${
          approved ? "bg-gradient-success" : "bg-gradient-danger"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-30" />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            {approved ? (
              <CheckCircle2 className="h-12 w-12 text-white" />
            ) : (
              <XCircle className="h-12 w-12 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-white">
            {approved ? "Loan Approved" : "Loan Not Approved"}
          </h2>
          <p className="mt-2 text-white/85">
            {approved
              ? "Congratulations — your profile meets the approval criteria."
              : "Your profile does not meet the current approval criteria."}
          </p>
          <div className="mx-auto mt-6 max-w-xs">
            <div className="mb-2 flex items-center justify-between text-sm text-white/85">
              <span>Approval confidence</span>
              <span className="font-semibold text-white">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold">Key factors in this decision</h3>
        <ul className="space-y-3">
          {result.factors.map((f, i) => {
            const Icon = f.impact === "positive" ? TrendingUp : f.impact === "negative" ? TrendingDown : Minus;
            const color =
              f.impact === "positive"
                ? "text-success bg-success/10"
                : f.impact === "negative"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground bg-muted";
            return (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{f.label}</p>
                  <p className="text-sm text-muted-foreground">{f.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Button onClick={onReset} variant="outline" className="w-full" size="lg">
        <RotateCcw className="mr-2 h-4 w-4" />
        Run another prediction
      </Button>
    </div>
  );
}
