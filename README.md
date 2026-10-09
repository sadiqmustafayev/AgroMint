# AgroMint AI — Enterprise Agricultural Intelligence Platform

> **Category:** AI Enterprise Solutions  
> **Mission:** Automating end-to-end field diagnostics, agronomic prescription, and supply chain procurement for commercial agricultural holdings and agribusinesses.

---

## 📑 Executive Enterprise Report
For a full breakdown of the corporate problem, As-Is vs. To-Be workflow analysis, architecture, and financial ROI models, please read:  
👉 **[Read the Full Enterprise Solutions Report](docs/ENTERPRISE_SOLUTION_REPORT.md)**

---

## 🌾 Overview

**AgroMint AI** is a B2B precision agriculture intelligence platform designed for commercial agricultural holdings (*aqroholdinqlər*), enterprise farm corporations, and agricultural advisory firms. 

Instead of waiting days for senior agronomists to manually correlate soil laboratory tests, crop phenology, academic literature, and weather forecasts, AgroMint AI automates this entire corporate workflow:
* **Ingests structured field telemetry** (soil chemistry, dynamic growth stages, field imagery).
* **Enriches with live 7-day weather telemetry** (rainfall, temperature, wind, and optimal spray windows).
* **Retrieves localized agronomic science** via an in-process RAG engine grounded in authoritative Azerbaijani agricultural textbooks (*Bitkiçilik*, *Kompleks gübrələr*, *Torpaqşünaslıq*).
* **Generates an executive diagnostic dossier in <10 seconds**, complete with visual nutrient gauges, precision fertilizer plans, weather-aligned irrigation schedules, disease/pest protocols, and 1–3–7 day operational roadmaps.

---

## 📊 Key Enterprise Adoption Metrics

| Metric | Traditional Workflow | With AgroMint AI | Enterprise ROI Impact |
| :--- | :--- | :--- | :--- |
| **Advisory Lead Time** | 3 – 7 business days | **< 10 seconds** | **>99.8% reduction in latency** |
| **Input Cost (Fertilizer/Chemicals)** | Blanket dosing ($120/ha) | **Precision dosing ($96/ha)** | **15% – 25% cost reduction** (~$48,000/yr savings on 2,000 ha) |
| **Yield Loss Risk from Delay** | 10% – 25% loss in outbreak zones | **< 3% loss through 24h spray plan** | **10% – 20% harvest value protected** (~$120,000 on 2,000 ha) |
| **Agronomist Scalability** | 800 ha / agronomist | **5,000 ha / agronomist** | **5.5x operational labor leverage** |

---

## 🏗️ Architecture & Technology Stack

```
[Field & Soil Lab Data] ──► [Live 7-Day Weather] ──► [Local Textbook RAG Engine] ──► [Gemini Multimodal AI] ──► [Executive Agronomic Dossier]
```

- **Frontend & App Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React
- **Validation & Forms:** React Hook Form, Zod schema validation
- **AI & Reasoning:** Google Gemini API (`gemini-3.1-flash-lite`, `gemini-3.5-flash`) with JSON mode schema enforcement and anti-hallucination dosage guardrails
- **Knowledge Base & RAG:** In-process sub-10ms scoring engine grounded in Azerbaijani agricultural textbooks
- **Meteorology Integration:** Real-time 7-day agricultural weather data via Open-Meteo API
- **Supply Chain Bridge:** Contextual B2B procurement integration with external agricultural marketplace (**AgroSphere**)
- **Testing:** Vitest, React Testing Library

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Hasawr/AgroMint.git

# Navigate to project directory
cd AgroMint

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the platform automatically utilizes its built-in resilient rules engine fallback).*

### Running the Application
```bash
# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests
```bash
# Run unit and integration tests
npm test
```

---

## 📁 Repository Structure

```
├── docs/
│   ├── ENTERPRISE_SOLUTION_REPORT.md  # Formal Enterprise Solution & ROI Report
│   └── superpowers/                   # Specs and implementation plans
├── src/
│   ├── app/                           # Next.js App Router pages (/ and /analyze)
│   ├── components/
│   │   ├── dashboard/                 # 10-card modular executive advisory cards
│   │   ├── farm-form/                 # 4-step structured intake wizard
│   │   └── shared/                    # Visual gauges, badges, AgroSphere links
│   ├── data/
│   │   └── agronomyKnowledgeBase.json # Curated Azerbaijani agronomy knowledge chunks
│   ├── lib/
│   │   ├── geminiAdvisor.ts           # Gemini prompt orchestration & report synthesis
│   │   ├── ragService.ts              # In-process RAG scoring & retrieval engine
│   │   ├── weatherService.ts          # Open-Meteo 7-day agricultural weather API
│   │   └── mockAdvisory.ts            # Resilient fallback rules engine
│   └── types/                         # TypeScript interfaces for farm & advisory schemas
└── tests/                             # Vitest unit and integration test suites
```

---

## 📄 License
This project is proprietary and developed for enterprise agricultural intelligence.
