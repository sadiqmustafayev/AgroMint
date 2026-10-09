# AgroMint AI — Frontend Platform Design Specification

**Date:** 2026-10-09  
**Status:** Validated Design (Draft for Review)  
**Target:** Frontend Architecture & UI/UX (excluding backend AI models)

---

## 1. Executive Summary & Vision

**AgroMint AI** is a professional agricultural intelligence platform engineered to bridge farmer-provided field observations with scientific agronomy insights. Unlike generic conversational AI chatbots, AgroMint AI utilizes structured data collection and organized, card-based diagnostics and recommendations.

This specification details the complete frontend website architecture, design system, interactive farm intake wizard, mock analysis workflow, and results dashboard. Real AI processing, automated soil report OCR parsing, and live weather telemetry will be integrated via defined API contracts in subsequent phases.

---

## 2. Global Constraints & Core Principles

1. **Identity Integrity:** The platform is strictly **AgroMint AI** (distinct from any references to AgroSphere AI).
2. **Not a Chatbot:** No conversational bubble UI or generic chat streams. Input is structured and multi-step; output is a comprehensive, scientific dashboard.
3. **AgroSphere External Separation:** AgroSphere is an external marketplace/service provider. It is referenced **only** via contextual external recommendation links (e.g., procurement of fertilizers, plant protection products, or agronomist bookings). No checkout, user accounts, or inventory are merged into AgroMint AI.
4. **Data Integrity & Evidence Badging:** Output must visually distinguish between:
   - **Submitted Data** (farmer's explicit input)
   - **AI Assessment** (diagnostic reasoning and interpretations)
   - **Actionable Recommendations** (context-aware farming steps)
   - **Uncertainties & Missing Data** (explicit disclosure of data gaps to avoid dangerous dosage recommendations)
5. **Progressive & Optional Input:** Farmers may skip unknown details. Form questions adapt dynamically (conditional logic per crop/soil inputs).
6. **AI Separation:** Frontend is architected with clean mock contracts (`/api/analyze` stub / state simulation) allowing immediate UI deployment and testing prior to backend AI connection.

---

## 3. Technology Stack & Architecture

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS (customized agri-tech palette: Emerald/Forest greens, clean neutrals, warning ambers)
- **UI Components:** Radix UI primitives / unstyled modular patterns (shadcn/ui style) with Tailwind
- **Form Architecture:** React Hook Form with Zod schema validation
- **Icons:** Lucide React (agricultural, environmental, and status iconography)
- **File Upload:** React Dropzone with preview support for soil PDFs and leaf/crop imagery
- **State Management & Mock Transport:** React Context / Zustand for wizard state preservation across `/` and `/analyze` routes; fallback URL/session persistence for guest sessions.

---

## 4. Route Map & Page Specifications

### 4.1. Homepage (`/`)

The homepage serves as the primary entry point and high-conversion intake gateway.

- **Navigation Bar:**
  - AgroMint AI logo and badge ("Agricultural Intelligence Platform").
  - Navigation anchors ("How It Works", "Knowledge Base References", "About AgroMint").
  - Account actions: "Sign In", "Create Account" (modal or route placeholders).
  - Guest consultation indicator ("No account required for initial consultation").
- **Hero Section:**
  - Clear value proposition: Context-aware agronomic intelligence combining field telemetry, soil analysis, and scientific literature.
  - Primary CTA: Smooth scrolls or focuses directly on the Farm Intake Form ("Start Agricultural Analysis").
- **Core Farm Intake Wizard:**
  A 4-step progressive form designed with clear progress indicators, validation, and optional skips:
  - **Step 1: Farm Location & Boundaries**
    - Region & District (cascading dropdowns or searchable select).
    - Total Farm Area in hectares (`number`, optional).
    - Topography / Field conditions (optional selection).
  - **Step 2: Crop Specifications & Dynamics**
    - Crop Selection (searchable multi-category list: Cereals, Orchards, Vegetables, Legumes, etc.).
    - Growth Stage (dynamically populated based on selected crop; e.g., Vegetative, Flowering, Grain Fill, Senescence).
    - Previous crop / crop rotation history (optional).
  - **Step 3: Soil & Irrigation Profile**
    - Soil Type (Sandy, Loamy, Clay, Silt, Peaty, Chalky, or "Unknown / Unsure").
    - Soil Analysis Report:
      - Toggle: **Document Upload** (PDF, PNG, JPG) or **Manual Data Entry** (pH, Organic Matter %, Nitrogen N, Phosphorus P, Potassium K, Salinity EC).
    - Irrigation Method (Drip, Sprinkler, Flood/Furrow, Rain-fed only).
    - Water Source (Borewell, Canal, River, Municipal, Rainwater reservoir).
  - **Step 4: Problem Statement & Media Upload**
    - Primary Agricultural Issue / Inquiry (structured textarea with prompt aids: pest symptoms, leaf yellowing, low yield, fertilizer query).
    - Media attachments: Drag-and-drop zone for plant photographs, soil lab sheets, leaf lesion photos.
  - **Submission & Pathways:**
    - Primary CTA: **"Analyze My Farm"** (Continues as Guest session with stored snapshot).
    - Secondary Option: "Save Farm to Account & Analyze" (prompts authentication modal without data loss).

---

### 4.2. Analysis Intermediate State (`/analyze?loading=true`)

A scientific analysis experience replacing typical spinning wheels:
- Agricultural diagnostics checklist simulation (Step 1: Normalizing soil metrics → Step 2: Correlating crop growth stage with reference guides → Step 3: Screening nutrient deficiency thresholds → Step 4: Compiling advisory report).
- Realistic, reassuring progress messaging (e.g., "Cross-referencing soil pH with nitrogen bioavailability...").
- Fast transition (mock delay adjustable, default 2.0s).

---

### 4.3. Personalized Results Dashboard (`/analyze`)

Organized as an executive agronomic diagnostic dossier:

1. **Header Banner:**
   - Farm Overview pill tags (Region, Crop, Growth Stage, Date of Analysis).
   - Export & Share utilities ("Export PDF Advisory", "Print Report", "Start New Assessment").
2. **Dashboard Grid Structure (10 Core Modular Cards):**
   - **Card 1: Farm Profile & Verified Submissions**
     - Summarizes farmer-submitted metrics with `Submitted Data` badges.
   - **Card 2: Main Agronomic Findings & Health Score**
     - Primary diagnosis summary, overall crop health/risk index.
   - **Card 3: Crop-Specific Cultivation Guidance**
     - Optimal temperature ranges, growth stage timing, canopy management.
   - **Card 4: Soil Fertility & Nutrient Matrix**
     - Visual gauges for pH, NPK balance, and salinity. Explicit warnings if data was estimated vs verified.
   - **Card 5: Fertilizer & Amendment Advisory**
     - Tailored organic/inorganic fertilizer plan.
     - Safe dosage guard: If soil data was missing, display caution ("General guidance only — lab test required for precise kg/ha application").
     - **AgroSphere Contextual Callout:** High-trust outbound card: *"Need certified fertilizers suited for this soil type? Explore verified distributors on AgroSphere →"*
   - **Card 6: Irrigation & Moisture Management**
     - Scheduling recommendation based on growth stage and irrigation type (drip/flood).
   - **Card 7: Plant Protection, Disease & Pest Management**
     - Identified risk profiles, preventative cultural controls, biological solutions.
     - **AgroSphere Contextual Callout:** *"Explore recommended organic and chemical plant protection products on AgroSphere →"*
   - **Card 8: Actionable Priority Next Steps**
     - Numbered 1-3-7 day schedule (e.g., Day 1: Adjust irrigation cycle, Day 3: Foliar micronutrient spray).
   - **Card 9: Data Uncertainties & Information Gaps**
     - Transparent breakdown of missing variables (e.g., exact soil organic matter not provided) and why they matter.
   - **Card 10: Scientific Literature & Agronomic Citations**
     - Curated citations to agricultural research extension manuals, FAO guidance, and soil science benchmarks.

---

### 4.4. Authentication Views (`/auth/login`, `/auth/register`)

- Streamlined farmer-friendly design.
- Phone number / Email login options.
- Visual confirmation that existing draft farm analysis won't be lost upon login.

---

## 5. Component Hierarchy & File Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with navbar and footer
│   ├── page.tsx                  # Homepage with Hero + Farm Intake Form
│   ├── analyze/
│   │   ├── page.tsx              # Analysis intermediate and Results Dashboard
│   ├── auth/
│   │   ├── login/page.tsx        # Login view
│   │   ├── register/page.tsx     # Registration view
│   └── globals.css               # Tailwind design tokens
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Header navigation & logo
│   │   └── Footer.tsx            # Legal, AgroMint attribution, external links
│   ├── farm-form/
│   │   ├── FarmWizard.tsx        # Master multi-step form controller
│   │   ├── StepLocation.tsx      # Step 1: Region, district, area
│   │   ├── StepCrop.tsx          # Step 2: Crop type & dynamic growth stage
│   │   ├── StepSoilWater.tsx     # Step 3: Soil metrics, upload, irrigation
│   │   ├── StepQuestionsMedia.tsx# Step 4: Problems, photo & PDF uploads
│   │   ├── FormProgressBar.tsx   # Step indicators and skip counters
│   │   └── SoilManualInput.tsx   # Expandable manual nutrient metrics
│   ├── dashboard/
│   │   ├── ResultsHeader.tsx     # Summary pills, print/download action
│   │   ├── FarmProfileCard.tsx   # Farmer input summary
│   │   ├── MainFindingsCard.tsx  # Executive summary & status
│   │   ├── CropAdvisoryCard.tsx  # Crop-specific guidelines
│   │   ├── SoilNutrientCard.tsx  # Soil gauges & fertility balance
│   │   ├── FertilizerCard.tsx    # Nutrient plan + AgroSphere outbound
│   │   ├── IrrigationCard.tsx    # Water scheduling recommendations
│   │   ├── PlantProtectionCard.tsx # Disease/pest management + AgroSphere link
│   │   ├── ActionStepsCard.tsx   # 1-3-7 day implementation plan
│   │   ├── UncertaintiesCard.tsx # Missing parameters & scientific caveats
│   │   └── CitationsCard.tsx     # Verified references
│   ├── shared/
│   │   ├── DataBadge.tsx         # 'Submitted', 'AI Assessment', 'Recommendation'
│   │   ├── AgroSphereLink.tsx    # Outbound card link with external icon
│   │   ├── FileUploadZone.tsx    # Drag-and-drop zone with file type badges
│   │   ├── MetricGauge.tsx       # Soil nutrient visual meter (Low/Optimal/High)
│   │   └── LoadingAnalysis.tsx   # Multi-stage agronomic loader
├── types/
│   ├── farm.ts                   # Types for farm inputs and form state
│   └── advisory.ts               # Types for advisory results & mock reports
├── lib/
│   ├── mockData.ts               # Sample advisory responses for various crops
│   ├── cropStages.ts             # Crop-specific stages lookup dictionary
│   └── validators.ts             # Zod schemas for farm form inputs
```

---

## 6. Design System & Visual Style Guide

- **Color Palette:**
  - `mint-primary`: `#10B981` (Emerald 500) & `#059669` (Emerald 600)
  - `mint-dark`: `#064E3B` (Forest deep green, high contrast text)
  - `mint-light`: `#ECFDF5` (Emerald 50, subtle card highlights)
  - `earth-sand`: `#FEF3C7` (Amber 100, caveat/uncertainty backgrounds)
  - `earth-warning`: `#D97706` (Amber 600, dosage precaution indicator)
  - `neutral-slate`: `#F8FAFC` to `#0F172A` (Crisp typographic contrast)
- **Typography:**
  - Modern sans-serif (`Inter` or system-native modern stack), robust tabular numbers for hectare and soil statistics.
- **Accessibility:**
  - WCAG AA compliant contrast on all badges and interactive form fields.
  - Full keyboard navigation for the step wizard.

---

## 7. Future Integration Readiness (Phase 2 & Beyond)

- **AI Engine Adapter:** Form output directly conforms to `FarmSubmissionPayload` schema, ready for ingestion by an LLM RAG orchestrator or agronomic microservice.
- **Scientific RAG Storage:** Result cards feature `sourceDocumentId` hooks to connect directly to vector-indexed PDF research publications.
- **Weather API Hook:** Dashboard header contains latent hook for live meteorological conditions (`/api/weather?region=X`).

---

## 8. Verification & Review Criteria

- [ ] Complete form wizard allows guest progression with only partial fields filled.
- [ ] Crop selection dynamically changes growth stage dropdown options.
- [ ] Soil test section seamlessly switches between PDF/Image upload and manual metric entry.
- [ ] Results dashboard clearly segregates submitted data vs advisory recommendations.
- [ ] AgroSphere links are strictly external and contextual with appropriate outbound tags.
- [ ] Responsive behavior tested on mobile viewports (375px+) and desktop (1280px+).
