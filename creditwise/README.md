# CreditWise — AI Loan Approval Prediction

<div align="center">

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwindcss)

**Know your loan chances before you walk into a bank.**

CreditWise predicts loan approval likelihood using a machine-learning model trained on 50,000+ real applications — paired with a polished, animated React frontend.

</div>

---

## How It Works

1. **Fill the 4-step form** — personal info, employment, financial profile, and loan details (18 fields).
2. **Get an instant prediction** — a probability score from 0–100% in under 5 seconds.
3. **Understand the "why"** — explainable factor cards show which inputs helped or hurt your score.

---

## Project Structure

```
creditwise/
├── frontend/                        # React 19 + TanStack Start web app
│   ├── src/
│   │   ├── routes/
│   │   │   ├── __root.tsx           # Root layout, fonts, global meta
│   │   │   └── index.tsx            # Landing page + prediction flow
│   │   ├── components/
│   │   │   ├── LoanForm.tsx         # 4-step multi-page wizard
│   │   │   ├── PredictionResultCard.tsx  # Results + explainability UI
│   │   │   └── ui/                  # shadcn/ui primitives
│   │   ├── lib/
│   │   │   ├── loanPredict.ts       # Scoring logic (swap for real ML API)
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   └── styles.css               # Design tokens + animations
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── wrangler.jsonc               # Cloudflare Workers config
└── ml/
    ├── credit-wise.ipynb            # EDA → preprocessing → training → eval
    └── loan_approval_data.csv       # Dataset: 50k+ applications, 18 features
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + [TanStack Start](https://tanstack.com/start) (Vite 7) |
| **Routing** | [TanStack Router](https://tanstack.com/router) — file-based |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS v4 · `oklch` design tokens · custom keyframe animations |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) |
| **Forms & Validation** | React Hook Form + Zod |
| **Icons / Charts** | Lucide React · Recharts |
| **ML** | Python · Pandas · NumPy · scikit-learn · Jupyter |
| **Deployment** | Cloudflare Workers (frontend) |

---

## Features

- ⚡ **Instant predictions** — heuristic scoring ready to swap for a trained model
- 🧭 **4-step wizard** — Personal → Employment → Financial → Loan Details
- 🔍 **Explainable results** — positive / negative / neutral factor cards
- 🎨 **Animated UI** — floating gradient blobs, staggered fade-ins, dark mode
- 📱 **Fully responsive** — mobile, tablet, and desktop
- ♿ **Accessible** — built on Radix UI primitives
- 🔒 **Privacy-first** — computation runs client-side by default

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (or [Bun](https://bun.sh) 1.0+)
- **Python** 3.10+

### Frontend

```bash
cd frontend
npm install       # or: bun install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

### ML Notebook

```bash
cd ml
pip install pandas numpy scikit-learn matplotlib seaborn jupyter
jupyter notebook credit-wise.ipynb
```

---

## Dataset

The dataset contains **50,000+ loan applications** across 18 features:

| Category | Fields |
|---|---|
| **Personal** | Gender, Marital Status, Age, Dependents, Education Level, Property Area |
| **Employment** | Employment Status, Employer Category, Applicant Income, Co-applicant Income |
| **Financial** | Credit Score, Existing Loans, DTI Ratio, Savings, Collateral Value |
| **Loan** | Loan Amount, Loan Term, Loan Purpose |
| **Target** | `Loan_Approved` — Yes / No |

---

## How the Prediction Works

The current `predictLoan()` in `frontend/src/lib/loanPredict.ts` uses a **rule-based heuristic** scoring six weighted signals:

| Signal | Max Points |
|---|---|
| Credit score (Poor / Fair / Good / Excellent tiers) | 35 |
| Debt-to-Income (DTI) ratio | 15 |
| EMI-to-income ratio | 15 |
| Employment stability | 10 |
| Collateral coverage | 10 |
| Savings buffer | 10 |

Score ≥ 60 → **Approved** · Score < 60 → **Declined**

---

## ML Notebook Walkthrough

The notebook is organized in four stages:

1. **EDA** — distributions, correlation heatmap, class balance, outlier detection
2. **Preprocessing** — encoding, scaling, missing value handling, train/test split (80/20 stratified)
3. **Training** — Logistic Regression baseline → Random Forest → optional Gradient Boosting with GridSearchCV
4. **Evaluation** — Accuracy, F1, ROC-AUC, confusion matrix, feature importance

---

## Connecting the Frontend to the ML Model

The heuristic is a working placeholder. To swap in your trained model:

**1. Export from the notebook:**

```python
import joblib
joblib.dump(model, "loan_model.joblib")
joblib.dump(preprocessor, "preprocessor.joblib")
```

**2. Serve as a FastAPI endpoint:**

```python
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("loan_model.joblib")
preprocessor = joblib.load("preprocessor.joblib")

@app.post("/predict")
def predict(data: dict):
    X = preprocessor.transform([data])
    prob = model.predict_proba(X)[0][1]
    return {"approved": prob >= 0.5, "probability": round(float(prob), 4), "factors": []}
```

**3. Update `frontend/src/lib/loanPredict.ts`:**

```ts
export async function predictLoan(input: LoanInput): Promise<PredictionResult> {
  const res = await fetch("https://your-api.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}
```

**API response shape required by the frontend:**

```ts
{
  approved: boolean;
  probability: number;        // 0..1
  factors: Array<{
    label: string;
    detail: string;
    impact: "positive" | "negative" | "neutral";
  }>;
}
```

---

## Deployment

### Cloudflare Workers (default)

```bash
cd frontend
npm run build
npx wrangler deploy
```

### Other Platforms

| Platform | Command |
|---|---|
| Vercel | Connect repo → set build command to `npm run build` |
| Netlify | Connect repo → build command `npm run build`, publish `.output/` |
| Node.js | `npm run build` → serve `.output/server/index.mjs` |

---

## Customization

All colors, gradients, and animations live in `frontend/src/styles.css` as CSS variables. Change one value to retheme the entire app:

```css
--primary:      oklch(0.52 0.19 265);
--primary-glow: oklch(0.68 0.18 280);
```

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `npm run lint && npm run format`
4. Open a Pull Request

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">
Built with React 19 + Python · TanStack Start · scikit-learn
</div>
