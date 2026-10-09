# AgroMint AI — Enterprise Agricultural Intelligence Platform

> **Category:** AI Enterprise Solutions  
> **Mission:** Automating end-to-end field diagnostics, agronomic prescription, and supply chain procurement for commercial agricultural holdings and agribusinesses.

---

## 📑 Core Documentation Dossiers

* 📄 **[Executive Enterprise Solution Report](docs/ENTERPRISE_SOLUTION_REPORT.md)** — Comprehensive breakdown of corporate bottlenecks, As-Is vs. To-Be workflow analysis, architecture, transparent financial ROI models, and regulatory compliance.
* 🧪 **[Agronomic Evaluation Benchmark & Safety Audit](docs/AGRONOMIC_EVALUATION_BENCHMARK.md)** — Empirical 16-case agricultural test matrix, agronomist scorecard, failure mode resolutions, and baseline comparisons (Plain Gemini vs. Rules vs. AgroMint RAG).

---

## 🌾 Platform Overview & Target User

**AgroMint AI** is a B2B precision agriculture intelligence platform engineered specifically for **commercial agricultural holdings (*aqroholdinqlər*)**, enterprise farm corporations (e.g., Pasha Agri, AzərŞəkər, Aran Aqro), and agricultural advisory firms managing 2,000 to 50,000+ hectares.

### The Enterprise Persona
* **Primary User:** Certified Senior Agronomists & Agricultural Asset Managers supervising dispersed field technicians across multiple districts (Aran, Ganja-Gazakh, Mil-Mughan, Karabakh).
* **The Corporate Problem:** Formulating accurate chemical dosages and fertilizer plans requires manual cross-referencing between soil lab PDFs, phenological growth charts, meteorological forecasts, and academic textbooks. This creates a **3-to-7 business day** bottleneck during which fungal pathogens and weed infestations spread exponentially, costing holdings millions in wasted chemical over-application and destroyed yield.

### The AgroMint Solution
AgroMint AI automates this operational workflow in **under 10 seconds**:
1. **Ingests structured field telemetry:** Region, crop phenology, soil chemistry (pH, EC, N-P-K), and scouting photo labels.
2. **Synchronizes with live 7-day agricultural weather:** Cumulative rainfall, wind speeds, spray window viability via Open-Meteo API.
3. **Retrieves localized agronomic science:** In-process sub-10ms RAG scoring engine grounded in authoritative Azerbaijani university textbooks (*Bitkiçilik*, *Kompleks gübrələr*, *Torpaqşünaslıq*).
4. **Synthesizes an executive 10-card diagnostic dossier:** Multi-factor dynamic health score, soil nutrient gauges, precision fertilizer prescriptions, weather-aligned irrigation schedules, plant protection protocols, and 1–3–7 day operational roadmaps.

---

## 📊 Transparent Enterprise ROI Models

To ensure rigor for corporate evaluation, AgroMint AI separates **modeled financial projections** from **empirical trial benchmarks**.

### Transparent Financial Arithmetic (2,000 Hectare Commercial Holding)

$$\text{Annual Chemical Savings } (S_{\text{fert}}) = \text{Area (2,000 ha)} \times \text{Baseline Input Spend (\$120/ha)} \times \text{Precision Optimization (20\%)} = \mathbf{\$48,000 \text{ / year}}$$

$$\text{Harvest Value Salvaged } (S_{\text{yield}}) = \text{Area (2,000 ha)} \times \text{Crop Revenue (\$1,200/ha)} \times \text{Protected Yield (5\%)} = \mathbf{\$120,000 \text{ / season}}$$

| Metric | Traditional Enterprise Baseline | With AgroMint AI | Modeled Financial Impact |
| :--- | :--- | :--- | :--- |
| **Advisory Lead Time** | 3 – 7 business days (manual review loop) | **< 10 seconds** (compute synthesis) | **>99.8% reduction in latency**; same-day tractor dispatch |
| **Input Cost (Fertilizer/Chemicals)** | Blanket dosing ($120/ha) | **Precision dosing ($96/ha)** | **20% cost reduction** (~$48,000/yr savings on 2,000 ha) |
| **Yield Loss Risk from Delay** | 10% – 25% loss in outbreak zones | **< 3% loss through 24h spray plan** | **5% – 10% harvest value protected** (~$120,000 on 2,000 ha) |
| **Agronomist Scalability** | 800 ha / agronomist | **5,000 ha / agronomist** | **5.5x operational labor leverage** |

---

## 🔬 Models, Data, Components & Disclosures

### 1. Models & Reasoning Core
* **Cloud AI Model:** Google Gemini 3.1 Flash Lite (`gemini-3.1-flash-lite`) and Gemini 3.5 Flash via Generative Language REST APIs with strict JSON schema enforcement (`temperature: 0.2`).
* **Resilient Rules Engine Fallback:** Built-in deterministic regional agricultural engine (`mockAdvisory.ts`) ensuring 100% platform availability if cloud APIs are offline.

### 2. Meteorological Telemetry
* **Live Weather Engine:** Real-time 7-day agricultural forecasts via the Open-Meteo REST API, calibrated to 15+ agricultural districts of Azerbaijan.
* **Fallback Transparency:** When live weather is unreachable, the system activates a historical regional baseline with an explicit `isSimulated = true` badge visible to the user.

### 3. Knowledge Base Provenance & RAG Retrieval
* **Corpus Provenance:** 33 curated and verified agronomic excerpts and rules transcribed directly from authoritative Azerbaijani university textbooks:
  - *Bitkiçilik (dərslik)* — Academician Q.Y. Məmmədov & Prof. M.M. İsmayılov (Bakı, 2018; Fəsil IV–VI, s. 142–248).
  - *Kompleks gübrələr və onlardan səmərəli istifadə qaydaları* (2019; s. 45–112).
  - *Torpaqşünaslıq və torpaq münbitliyi mühazirələri* (2016; s. 78–190).
* **Retrieval Mechanism:** Sub-10ms deterministic BM25-style lexical scoring evaluating crop taxonomy (+30), agronomic categories (+15), phrase matching (+18), and token density without external vector database network overhead.

### 4. Multimodal Telemetry & Vision Architecture
* **Current Implementation:** Field telemetry intake ingests field scouting imagery and PDF soil laboratory test metadata, incorporating visual symptom descriptors into diagnostic prompts.
* **Production Vision Roadmap:** Direct tensor ingestion architecture ready for the Google Gemini Vision API for automated leaf lesion segmentation and weed classification.

### 5. AI Tooling Disclosure
* Developed with pair-programming assistance from **Google Antigravity** and the **Superpowers** agentic AI framework.

---

## 🛡️ Anti-Hallucination Dosage Guardrails & Safety Architecture

Prescribing agricultural chemicals without verified soil chemistry risks chemical leaf scorch, groundwater pollution, and legal liability. AgroMint AI enforces a **two-tier safety guardrail**:
1. **Prompt Schema Prohibition:** Instructs the language model that when soil metrics are unverified, quantitative kg/ha application rates are strictly prohibited and prescriptions must be marked as guarded qualitative guidance.
2. **Code-Level Sanitizer (`geminiAdvisor.ts`):** Post-processes every generated prescription. If certified soil laboratory metrics are missing, any quantitative rate (e.g. `150-180 kg/ha`) is programmatically intercepted and replaced with:  
   *`"Laboratoriya təsdiqi tələb olunur (Dəqiq norma dayandırılıb)"`*
3. **Phenological Stage Discrimination:** Prohibits premature harvest defoliants on vegetative crops (e.g., Ethephon is restricted strictly to mature cotton bolls; irrigation is never halted on early vegetative plants).

---

## ⚡ Unit Economics & Production Feasibility

* **API Compute Cost per Dossier:** **$0.000495 USD (~0.00084 AZN)** based on Gemini 3.1 Flash Lite pricing ($0.075/1M input, $0.30/1M output tokens). Running 1,000 field analyses costs less than $0.50 USD.
* **Rate Limiting:** In-memory sliding-window rate limiter in `/api/analyze/route.ts` caps traffic at **10 requests/minute per IP** (`HTTP 429 Too Many Requests`), protecting API keys and preventing denial-of-service.
* **Language Switch Caching:** Client-side cache prevents duplicate API re-fetches when toggling between English and Azerbaijani on the results dashboard.
* **Executive Print Dossier:** Custom print stylesheets format `window.print()` into clean, boardroom-ready PDF diagnostic dossiers.

---

## ⚖️ Regulatory Compliance & Agronomic Liability Disclaimer

* **Decision-Support Classification:** AgroMint AI is an **Executive Agronomic Decision Support Platform (ADSP)**. It generates recommendations for professional review, not autonomous chemical application.
* **Regulatory Conformity:** All recommended active substances (Glyphosate, Pendimethalin, Ethephon, Imidacloprid, Azoxystrobin) are registered in the State Register of Approved Plant Protection Substances (Republic of Azerbaijan Ministry of Agriculture).
* **Human-in-the-Loop Requirement:** Prescriptions mandate on-site validation and physical sign-off by the enterprise holding's certified chief agronomist prior to tractor dispatch.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.x or 20.x
* npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Hasawr/AgroMint.git

# Navigate to project directory
cd AgroMint

# Install dependencies
npm install
```

### Environment Configuration (Optional)
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the platform automatically and resiliently runs on its built-in rules engine fallback. All 79 tests pass 100% cleanly without an API key).*

### Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests & Evaluation Benchmarks
```bash
# Run complete test suite (79 tests across 25 suites)
npm test

# Run the 16-case Agronomic Evaluation Benchmark
npx vitest run tests/agronomicEvaluationBenchmark.test.ts
```

---

## 📁 Repository Structure

```
├── docs/
│   ├── ENTERPRISE_SOLUTION_REPORT.md      # Comprehensive Enterprise Solution & ROI Report
│   ├── AGRONOMIC_EVALUATION_BENCHMARK.md  # 16-Case Agronomic Benchmark & Safety Audit
│   └── superpowers/                       # Specs and architecture plans
├── src/
│   ├── app/                               # Next.js App Router (/ , /analyze, /auth)
│   │   └── api/analyze/                   # Rate-limited advisory synthesis endpoint
│   ├── components/
│   │   ├── dashboard/                     # 10-card modular executive advisory cards
│   │   ├── farm-form/                     # 4-step structured intake wizard
│   │   └── shared/                        # Gauges, badges, AgroSphere supply chain bridge
│   ├── data/
│   │   └── agronomyKnowledgeBase.json     # Curated Azerbaijani agronomic knowledge chunks
│   ├── lib/
│   │   ├── geminiAdvisor.ts               # Gemini AI prompt orchestration & dosage guardrail
│   │   ├── mockAdvisory.ts                # Resilient rules engine & dynamic health score
│   │   ├── ragService.ts                  # In-process lexical BM25-style RAG retrieval
│   │   └── weatherService.ts              # Open-Meteo 7-day agricultural weather engine
│   └── types/                             # TypeScript schemas for farm & advisory dossiers
└── tests/                                 # 25 Vitest test suites (79 passing tests)
    └── agronomicEvaluationBenchmark.test.ts # Formal 16-case agricultural benchmark
```

---

## 📄 License
Developed for enterprise agricultural intelligence. Excerpts from Azerbaijani agronomic literature are utilized for educational demonstration under fair-use principles.
