import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  User, Briefcase, Wallet, Landmark, Sparkles,
  ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import type { LoanInput, PredictionResult } from "@/lib/loanPredict";
import { predictLoan } from "@/lib/loanPredict";

interface Props {
  onResult: (r: PredictionResult, i: LoanInput) => void;
}

const STEPS = [
  { id: 1, title: "Personal", icon: User },
  { id: 2, title: "Employment", icon: Briefcase },
  { id: 3, title: "Financial", icon: Wallet },
  { id: 4, title: "Loan Details", icon: Landmark },
];

const defaults: LoanInput = {
  Applicant_Income: 8000,
  Coapplicant_Income: 2000,
  Employment_Status: "Salaried",
  Age: 32,
  Marital_Status: "Married",
  Dependents: 1,
  Credit_Score: 700,
  Existing_Loans: 1,
  DTI_Ratio: 0.3,
  Savings: 5000,
  Collateral_Value: 20000,
  Loan_Amount: 15000,
  Loan_Term: 36,
  Loan_Purpose: "Personal",
  Property_Area: "Urban",
  Education_Level: "Graduate",
  Gender: "Male",
  Employer_Category: "Private",
};

export function LoanForm({ onResult }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<LoanInput>(defaults);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof LoanInput>(k: K, v: LoanInput[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    setSubmitting(true);
    // Tiny delay so the UX feels like a real prediction call
    await new Promise((r) => setTimeout(r, 700));
    const result = predictLoan(data);
    setSubmitting(false);
    onResult(result, data);
  };

  return (
    <div className="rounded-2xl border bg-card shadow-elegant">
      {/* Stepper */}
      <div className="flex items-center justify-between border-b p-6">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-smooth ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : done
                      ? "border-success bg-success text-success-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-smooth ${
                    done ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <Heading title="Tell us about yourself" subtitle="Basic personal information" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Gender">
                <Select value={data.Gender} onValueChange={(v) => update("Gender", v as LoanInput["Gender"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Marital Status">
                <Select value={data.Marital_Status} onValueChange={(v) => update("Marital_Status", v as LoanInput["Marital_Status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={`Age — ${data.Age} years`}>
                <Slider value={[data.Age]} min={21} max={65} step={1} onValueChange={([v]) => update("Age", v)} />
              </Field>
              <Field label={`Dependents — ${data.Dependents}`}>
                <Slider value={[data.Dependents]} min={0} max={5} step={1} onValueChange={([v]) => update("Dependents", v)} />
              </Field>
              <Field label="Education Level">
                <Select value={data.Education_Level} onValueChange={(v) => update("Education_Level", v as LoanInput["Education_Level"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Not Graduate">Not Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Property Area">
                <Select value={data.Property_Area} onValueChange={(v) => update("Property_Area", v as LoanInput["Property_Area"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urban">Urban</SelectItem>
                    <SelectItem value="Semiurban">Semi-urban</SelectItem>
                    <SelectItem value="Rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Heading title="Employment details" subtitle="Help us understand your income source" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Employment Status">
                <Select value={data.Employment_Status} onValueChange={(v) => update("Employment_Status", v as LoanInput["Employment_Status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salaried">Salaried</SelectItem>
                    <SelectItem value="Self-employed">Self-employed</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Employer Category">
                <Select value={data.Employer_Category} onValueChange={(v) => update("Employer_Category", v as LoanInput["Employer_Category"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="MNC">MNC</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Applicant Monthly Income ($)">
                <Input type="number" min={0} value={data.Applicant_Income}
                  onChange={(e) => update("Applicant_Income", Number(e.target.value))} />
              </Field>
              <Field label="Co-applicant Monthly Income ($)">
                <Input type="number" min={0} value={data.Coapplicant_Income}
                  onChange={(e) => update("Coapplicant_Income", Number(e.target.value))} />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Heading title="Financial profile" subtitle="Your credit and existing obligations" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={`Credit Score — ${data.Credit_Score}`}>
                <Slider value={[data.Credit_Score]} min={300} max={850} step={1}
                  onValueChange={([v]) => update("Credit_Score", v)} />
                <p className="mt-1 text-xs text-muted-foreground">300–579 Poor · 580–669 Fair · 670–739 Good · 740+ Excellent</p>
              </Field>
              <Field label={`Existing Loans — ${data.Existing_Loans}`}>
                <Slider value={[data.Existing_Loans]} min={0} max={5} step={1}
                  onValueChange={([v]) => update("Existing_Loans", v)} />
              </Field>
              <Field label={`Debt-to-Income Ratio — ${data.DTI_Ratio.toFixed(2)}`}>
                <Slider value={[data.DTI_Ratio]} min={0} max={1} step={0.01}
                  onValueChange={([v]) => update("DTI_Ratio", v)} />
              </Field>
              <Field label="Total Savings ($)">
                <Input type="number" min={0} value={data.Savings}
                  onChange={(e) => update("Savings", Number(e.target.value))} />
              </Field>
              <Field label="Collateral Value ($)">
                <Input type="number" min={0} value={data.Collateral_Value}
                  onChange={(e) => update("Collateral_Value", Number(e.target.value))} />
              </Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <Heading title="Loan request" subtitle="What are you applying for?" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Loan Amount ($)">
                <Input type="number" min={0} value={data.Loan_Amount}
                  onChange={(e) => update("Loan_Amount", Number(e.target.value))} />
              </Field>
              <Field label={`Loan Term — ${data.Loan_Term} months`}>
                <Slider value={[data.Loan_Term]} min={6} max={120} step={6}
                  onValueChange={([v]) => update("Loan_Term", v)} />
              </Field>
              <Field label="Loan Purpose">
                <Select value={data.Loan_Purpose} onValueChange={(v) => update("Loan_Purpose", v as LoanInput["Loan_Purpose"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-4 rounded-xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Estimated monthly EMI (no interest)</p>
              <p className="text-2xl font-bold text-primary">
                ${(data.Loan_Amount / Math.max(data.Loan_Term, 1)).toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={prev} disabled={step === 1}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < 4 ? (
            <Button onClick={next} className="bg-gradient-primary text-primary-foreground shadow-glow">
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}
              className="bg-gradient-primary text-primary-foreground shadow-glow">
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Predict Approval</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
