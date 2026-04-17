export type LoanInput = {
  Applicant_Income: number;
  Coapplicant_Income: number;
  Employment_Status: "Salaried" | "Self-employed" | "Contract" | "Unemployed";
  Age: number;
  Marital_Status: "Single" | "Married";
  Dependents: number;
  Credit_Score: number;
  Existing_Loans: number;
  DTI_Ratio: number;
  Savings: number;
  Collateral_Value: number;
  Loan_Amount: number;
  Loan_Term: number;
  Loan_Purpose: "Personal" | "Home" | "Car" | "Education" | "Business";
  Property_Area: "Urban" | "Semiurban" | "Rural";
  Education_Level: "Graduate" | "Not Graduate";
  Gender: "Male" | "Female";
  Employer_Category: "Private" | "Government" | "MNC" | "Business" | "Unemployed";
};

export type PredictionResult = {
  approved: boolean;
  probability: number; // 0..1
  factors: { label: string; impact: "positive" | "negative" | "neutral"; detail: string }[];
};

/**
 * Heuristic stand-in for the trained ML model.
 * Replace with a fetch() to your deployed model endpoint when ready.
 */
export function predictLoan(input: LoanInput): PredictionResult {
  let score = 0;
  const factors: PredictionResult["factors"] = [];

  // Credit score (strongest signal)
  if (input.Credit_Score >= 750) { score += 35; factors.push({ label: "Excellent credit score", impact: "positive", detail: `${input.Credit_Score}` }); }
  else if (input.Credit_Score >= 680) { score += 20; factors.push({ label: "Good credit score", impact: "positive", detail: `${input.Credit_Score}` }); }
  else if (input.Credit_Score >= 620) { score += 5; factors.push({ label: "Fair credit score", impact: "neutral", detail: `${input.Credit_Score}` }); }
  else { score -= 20; factors.push({ label: "Low credit score", impact: "negative", detail: `${input.Credit_Score}` }); }

  // DTI
  if (input.DTI_Ratio <= 0.25) { score += 15; factors.push({ label: "Healthy DTI ratio", impact: "positive", detail: input.DTI_Ratio.toFixed(2) }); }
  else if (input.DTI_Ratio <= 0.4) { score += 5; }
  else { score -= 15; factors.push({ label: "High debt-to-income", impact: "negative", detail: input.DTI_Ratio.toFixed(2) }); }

  // Income vs loan amount
  const totalIncome = input.Applicant_Income + input.Coapplicant_Income;
  const monthlyEMI = input.Loan_Amount / Math.max(input.Loan_Term, 1);
  const emiRatio = monthlyEMI / Math.max(totalIncome, 1);
  if (emiRatio < 0.3) { score += 15; factors.push({ label: "Affordable EMI vs income", impact: "positive", detail: `${(emiRatio * 100).toFixed(0)}%` }); }
  else if (emiRatio < 0.5) { score += 3; }
  else { score -= 18; factors.push({ label: "EMI burden too high", impact: "negative", detail: `${(emiRatio * 100).toFixed(0)}%` }); }

  // Employment
  if (input.Employment_Status === "Unemployed") { score -= 25; factors.push({ label: "Unemployed", impact: "negative", detail: "No stable income" }); }
  else if (input.Employment_Status === "Salaried") { score += 10; factors.push({ label: "Salaried employment", impact: "positive", detail: "Stable income" }); }
  else if (input.Employment_Status === "Contract") { score -= 3; }

  // Collateral
  if (input.Collateral_Value >= input.Loan_Amount) { score += 12; factors.push({ label: "Collateral covers loan", impact: "positive", detail: "Secured" }); }
  else if (input.Collateral_Value >= input.Loan_Amount * 0.5) { score += 4; }
  else { score -= 6; }

  // Savings cushion
  if (input.Savings >= input.Loan_Amount * 0.2) { score += 8; factors.push({ label: "Strong savings cushion", impact: "positive", detail: `$${input.Savings.toLocaleString()}` }); }
  else if (input.Savings < 1000) { score -= 5; }

  // Existing loans
  if (input.Existing_Loans === 0) { score += 6; }
  else if (input.Existing_Loans >= 3) { score -= 10; factors.push({ label: "Multiple existing loans", impact: "negative", detail: `${input.Existing_Loans}` }); }

  // Education
  if (input.Education_Level === "Graduate") score += 4;

  // Property area
  if (input.Property_Area === "Urban") score += 3;
  else if (input.Property_Area === "Rural") score -= 2;

  // Age
  if (input.Age < 23 || input.Age > 60) score -= 5;

  // Convert to probability via sigmoid centered at 0
  const probability = 1 / (1 + Math.exp(-score / 18));
  const approved = probability >= 0.5;

  return { approved, probability, factors: factors.slice(0, 6) };
}
