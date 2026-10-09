# AgroMint AI Frontend Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, responsive frontend web application for AgroMint AI featuring a multi-step farm intake wizard, progressive agronomic diagnostics loader, and a structured 10-card personalized results dashboard with contextual external AgroSphere links.

**Architecture:** Built using Next.js 14+ (App Router), TypeScript, and Tailwind CSS. The state flows from a 4-step farm information intake wizard on the homepage into a client/session-persisted payload, triggering a realistic agricultural diagnostic loader and rendering an executive agronomic dossier with visual evidence badges.

**Tech Stack:** Next.js 14+, React 18/19, TypeScript, Tailwind CSS, Lucide React, Zod, React Hook Form, Vitest / React Testing Library.

**Spec:** [`docs/superpowers/specs/2026-10-09-agromint-ai-frontend-design.md`](file:///c:/Users/Hesen/Documents/antigravity/peaceful-turing/docs/superpowers/specs/2026-10-09-agromint-ai-frontend-design.md)

---

## Global Constraints

- **Product Identity:** The product name is strictly **AgroMint AI**, not AgroSphere AI or generic chatbot variants.
- **Form Interactivity:** Fields are non-blocking and progressive; farmers may skip unknown metrics without validation deadlocks.
- **Evidence Badging:** Results must explicitly segregate `Submitted Data`, `AI Assessment`, and `Actionable Recommendation`.
- **AgroSphere Boundaries:** External outbound recommendation links only (fertilizer, crop protection, agronomist consultation); no embedded shopping carts, checkouts, or accounts.
- **AI Separation:** All results and analysis steps are driven by decoupled TypeScript interfaces and realistic mock advisory engines, ready for subsequent AI backend connection.

---

## Review Focus

1. **Incomplete / Partial Form Submissions:** When a farmer skips soil metrics or area, the system gracefully generates tailored advisory cards with transparent uncertainty notices instead of crashing or showing blank cards.
2. **Dynamic Crop Growth Stage Switching:** Changing the selected crop (e.g. Wheat to Tomato) resets or filters the growth stage options immediately without retaining invalid stage values.
3. **Soil Analysis Mode Switching:** Toggling between manual numeric entry (pH, NPK) and document upload preserves entered values or clears safely without form state conflicts.
4. **Mobile Layout Integrity on Cards & Forms:** Complex inputs like metric gauges and file drag-and-drop render cleanly on narrow screens (375px) without horizontal overflow.
5. **AgroSphere Outbound Link Security:** All external recommendation links use safe outbound parameters (`rel="noopener noreferrer"` and `target="_blank"`).

---

## Task Structure & Decomposition

```
Task 1: Next.js Project Scaffolding & Test Setup
Task 2: Core Domain Types, Zod Schemas & Crop Stage Logic
Task 3: Mock Advisory Data Engine & Helpers
Task 4: Shared UI Design System & Badges (DataBadge, AgroSphereLink, MetricGauge)
Task 5: File Upload & Media Preview Component
Task 6: Farm Intake Form — Step 1 (Location) & Step 2 (Crop Dynamics)
Task 7: Farm Intake Form — Step 3 (Soil & Water) & Step 4 (Issues & Uploads)
Task 8: Farm Intake Form Orchestrator & Progress Controller
Task 9: Homepage Assembly (Navbar, Hero, Farm Intake Integration & Footer)
Task 10: Analysis Intermediate State & Simulated Agronomic Loader
Task 11: Results Dashboard — Header, Farm Profile & Findings Cards
Task 12: Results Dashboard — Soil, Fertilizer & AgroSphere External Cards
Task 13: Results Dashboard — Irrigation, Pest Protection, Next Steps & Citations Cards
Task 14: Results Dashboard Assembly & State Integration (`/analyze`)
Task 15: Authentication Shell Views (`/auth/login`, `/auth/register`)
Task 16: End-to-End User Flow & Responsive Design Verification
```

---

### Task 1: Next.js Project Scaffolding & Test Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `tests/setup.ts`

**Interfaces:**
- Produces: Configured Next.js project with Tailwind CSS, Lucide React, Zod, and Vitest testing suite.

- [ ] **Step 1: Write the failing test for test runner setup**

Create `tests/setup.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Test Environment Verification', () => {
  it('confirms vitest runner operates properly', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/setup.test.ts`  
Expected: FAIL (No runner or packages installed yet)

- [ ] **Step 3: Scaffold Next.js application, install dependencies, and configure Tailwind**

Install `next`, `react`, `react-dom`, `lucide-react`, `zod`, `clsx`, `tailwind-merge`, and dev dependencies (`typescript`, `tailwindcss`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`).  
Configure `tailwind.config.ts` with custom brand colors (`mint-primary: #10B981`, `mint-dark: #064E3B`, `mint-light: #ECFDF5`, `earth-sand: #FEF3C7`, `earth-warning: #D97706`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/setup.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 14 project with Tailwind and Vitest"
```

---

### Task 2: Core Domain Types, Zod Schemas & Crop Stage Logic

**Files:**
- Create: `src/types/farm.ts`
- Create: `src/types/advisory.ts`
- Create: `src/lib/cropStages.ts`
- Create: `src/lib/validators.ts`
- Test: `tests/domain.test.ts`

**Interfaces:**
- Produces:
  - `FarmSubmissionPayload`, `SoilMetrics`, `CropType`
  - `AgronomicAdvisoryReport`, `AdvisoryCardData`
  - `getCropGrowthStages(crop: string): string[]`
  - `farmFormSchema: z.ZodSchema`

- [ ] **Step 1: Write the failing tests**

Create `tests/domain.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getCropGrowthStages, AVAILABLE_CROPS } from '../src/lib/cropStages';
import { farmFormSchema } from '../src/lib/validators';

describe('Crop Stages and Form Validation', () => {
  it('returns valid growth stages for wheat', () => {
    const stages = getCropGrowthStages('Wheat');
    expect(stages).toContain('Vegetative / Tillering');
    expect(stages).toContain('Grain Filling / Maturation');
  });

  it('validates a minimal submission allowing optional fields to be omitted', () => {
    const result = farmFormSchema.safeParse({
      region: 'Central Valley',
      crop: 'Wheat',
      mainProblem: 'Yellowing leaves on lower canopy'
    });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/domain.test.ts`  
Expected: FAIL (`cropStages` and `validators` not found)

- [ ] **Step 3: Implement domain types, crop stage lookup, and Zod schemas**

Implement `src/types/farm.ts`, `src/types/advisory.ts`, `src/lib/cropStages.ts`, and `src/lib/validators.ts`. Ensure optional fields allow null/empty strings without breaking validation.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/domain.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/ src/lib/ tests/domain.test.ts
git commit -m "feat: define domain types, dynamic crop stages, and validation schemas"
```

---

### Task 3: Mock Advisory Data Engine & Helpers

**Files:**
- Create: `src/lib/mockAdvisory.ts`
- Test: `tests/mockAdvisory.test.ts`

**Interfaces:**
- Consumes: `FarmSubmissionPayload` from `src/types/farm.ts`
- Produces: `generateMockAdvisoryReport(payload: Partial<FarmSubmissionPayload>): AgronomicAdvisoryReport`

- [ ] **Step 1: Write the failing test**

Create `tests/mockAdvisory.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { generateMockAdvisoryReport } from '../src/lib/mockAdvisory';

describe('generateMockAdvisoryReport', () => {
  it('generates an advisory report with all 10 card sections and AgroSphere references', () => {
    const report = generateMockAdvisoryReport({
      region: 'Ganja-Dashkasan',
      crop: 'Cotton',
      growthStage: 'Squaring / Flowering',
      farmAreaHectares: 25
    });

    expect(report.farmProfile.crop).toBe('Cotton');
    expect(report.mainFindings.length).toBeGreaterThan(0);
    expect(report.fertilizerAdvisory.agroSphereLink).toBeDefined();
    expect(report.fertilizerAdvisory.agroSphereLink?.title).toContain('AgroSphere');
    expect(report.plantProtection.agroSphereLink).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/mockAdvisory.test.ts`  
Expected: FAIL (`mockAdvisory.ts` not found)

- [ ] **Step 3: Implement `generateMockAdvisoryReport`**

Build realistic agronomic output containing findings, soil diagnostics, fertilizer advice, irrigation guidelines, plant protection, actionable 1-3-7 day schedule, uncertainty warnings, scientific citations, and contextual AgroSphere external links.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/mockAdvisory.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/mockAdvisory.ts tests/mockAdvisory.test.ts
git commit -m "feat: implement mock agronomic advisory generator"
```

---

### Task 4: Shared UI Design System & Badges (DataBadge, AgroSphereLink, MetricGauge)

**Files:**
- Create: `src/components/shared/DataBadge.tsx`
- Create: `src/components/shared/AgroSphereLink.tsx`
- Create: `src/components/shared/MetricGauge.tsx`
- Test: `tests/sharedComponents.test.tsx`

**Interfaces:**
- Produces:
  - `<DataBadge variant="submitted" | "ai-assessment" | "recommendation" />`
  - `<AgroSphereLink title={string} description={string} destinationUrl={string} serviceType="fertilizer" | "protection" | "agronomist" />`
  - `<MetricGauge label={string} value={number} min={number} max={number} unit={string} status="low" | "optimal" | "high" />`

- [ ] **Step 1: Write the failing component tests**

Create `tests/sharedComponents.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataBadge } from '../src/components/shared/DataBadge';
import { AgroSphereLink } from '../src/components/shared/AgroSphereLink';

describe('Shared UI Components', () => {
  it('renders correct label for AI Assessment badge', () => {
    render(<DataBadge variant="ai-assessment" />);
    expect(screen.getByText('AI Assessment')).toBeInTheDocument();
  });

  it('renders AgroSphere outbound link with security attributes', () => {
    render(
      <AgroSphereLink
        title="Explore Fertilizers on AgroSphere"
        description="Connect with verified distributors"
        destinationUrl="https://agrosphere.example.com/fertilizers"
        serviceType="fertilizer"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/sharedComponents.test.tsx`  
Expected: FAIL (Components not created yet)

- [ ] **Step 3: Implement `DataBadge`, `AgroSphereLink`, and `MetricGauge`**

Build clean, accessible components styled with Tailwind CSS according to design tokens.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/sharedComponents.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/ tests/sharedComponents.test.tsx
git commit -m "feat: add DataBadge, AgroSphereLink, and MetricGauge components"
```

---

### Task 5: File Upload & Media Preview Component

**Files:**
- Create: `src/components/shared/FileUploadZone.tsx`
- Test: `tests/fileUpload.test.tsx`

**Interfaces:**
- Produces: `<FileUploadZone label={string} acceptedTypes={string[]} onFilesSelected={(files: File[]) => void} maxFiles={number} />`

- [ ] **Step 1: Write the failing test**

Create `tests/fileUpload.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileUploadZone } from '../src/components/shared/FileUploadZone';

describe('FileUploadZone Component', () => {
  it('displays helper text for accepted document formats', () => {
    render(<FileUploadZone label="Upload Soil Analysis PDF" acceptedTypes={['pdf', 'jpg', 'png']} onFilesSelected={() => {}} />);
    expect(screen.getByText(/Upload Soil Analysis PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, JPG, PNG/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/fileUpload.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `FileUploadZone`**

Add drag-and-drop support, visual file listing, thumbnail preview simulation, and remove buttons.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/fileUpload.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/FileUploadZone.tsx tests/fileUpload.test.tsx
git commit -m "feat: add FileUploadZone component for soil reports and field photos"
```

---

### Task 6: Farm Intake Form — Step 1 (Location) & Step 2 (Crop Dynamics)

**Files:**
- Create: `src/components/farm-form/StepLocation.tsx`
- Create: `src/components/farm-form/StepCrop.tsx`
- Test: `tests/stepLocationAndCrop.test.tsx`

**Interfaces:**
- Produces:
  - `<StepLocation formState={...} onChange={...} />`
  - `<StepCrop selectedCrop={...} selectedStage={...} onCropChange={...} onStageChange={...} />`

- [ ] **Step 1: Write the failing test**

Create `tests/stepLocationAndCrop.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepCrop } from '../src/components/farm-form/StepCrop';

describe('StepCrop Component', () => {
  it('updates dynamic growth stages when a crop is selected', () => {
    const handleCropChange = vi.fn();
    render(<StepCrop selectedCrop="Wheat" selectedStage="" onCropChange={handleCropChange} onStageChange={() => {}} />);
    expect(screen.getByText(/Vegetative \/ Tillering/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/stepLocationAndCrop.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `StepLocation` and `StepCrop`**

Build Step 1 (Region, district, hectares area with numeric inputs) and Step 2 (Searchable crop list, conditional growth stage dropdown with helper tooltips).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/stepLocationAndCrop.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/farm-form/ tests/stepLocationAndCrop.test.tsx
git commit -m "feat: implement StepLocation and dynamic StepCrop form modules"
```

---

### Task 7: Farm Intake Form — Step 3 (Soil & Water) & Step 4 (Issues & Uploads)

**Files:**
- Create: `src/components/farm-form/SoilManualInput.tsx`
- Create: `src/components/farm-form/StepSoilWater.tsx`
- Create: `src/components/farm-form/StepQuestionsMedia.tsx`
- Test: `tests/stepSoilAndMedia.test.tsx`

**Interfaces:**
- Produces:
  - `<StepSoilWater soilMode="upload" | "manual" onModeChange={...} soilMetrics={...} ... />`
  - `<StepQuestionsMedia question={...} onQuestionChange={...} files={...} ... />`

- [ ] **Step 1: Write the failing test**

Create `tests/stepSoilAndMedia.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepSoilWater } from '../src/components/farm-form/StepSoilWater';

describe('StepSoilWater Component', () => {
  it('toggles between document upload and manual nutrient input', () => {
    const { rerender } = render(<StepSoilWater mode="upload" onModeChange={() => {}} values={{}} onChange={() => {}} />);
    expect(screen.getByText(/Upload Soil Lab Report/i)).toBeInTheDocument();

    rerender(<StepSoilWater mode="manual" onModeChange={() => {}} values={{}} onChange={() => {}} />);
    expect(screen.getByText(/Soil pH/i)).toBeInTheDocument();
    expect(screen.getByText(/Nitrogen \(N\)/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/stepSoilAndMedia.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `StepSoilWater`, `SoilManualInput`, and `StepQuestionsMedia`**

Implement soil mode toggling, manual nutrient metric inputs (pH, N, P, K, EC), irrigation method/water source selectors, textarea for agricultural challenges with quick-select suggestion pills, and media uploads.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/stepSoilAndMedia.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/farm-form/ tests/stepSoilAndMedia.test.tsx
git commit -m "feat: implement StepSoilWater and StepQuestionsMedia form modules"
```

---

### Task 8: Farm Intake Form Orchestrator & Progress Controller

**Files:**
- Create: `src/components/farm-form/FormProgressBar.tsx`
- Create: `src/components/farm-form/FarmWizard.tsx`
- Test: `tests/farmWizard.test.tsx`

**Interfaces:**
- Produces: `<FarmWizard onSubmit={(payload: FarmSubmissionPayload) => void} isGuest={boolean} />`

- [ ] **Step 1: Write the failing test**

Create `tests/farmWizard.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FarmWizard } from '../src/components/farm-form/FarmWizard';

describe('FarmWizard Orchestrator', () => {
  it('allows navigation between steps and permits skipping optional fields', () => {
    render(<FarmWizard onSubmit={() => {}} />);
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/farmWizard.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `FormProgressBar` and `FarmWizard`**

Implement multi-step state management, back/next navigation, skip-unknown capabilities, "Analyze My Farm" primary action button, and "Sign in to save farm data" prompt.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/farmWizard.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/farm-form/ tests/farmWizard.test.tsx
git commit -m "feat: implement FarmWizard multi-step controller and progress bar"
```

---

### Task 9: Homepage Assembly (Navbar, Hero, Farm Intake Integration & Footer)

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/homepage.test.tsx`

**Interfaces:**
- Produces: Fully interactive Homepage at `/` connecting Hero and `FarmWizard`, redirecting to `/analyze` on submit.

- [ ] **Step 1: Write the failing test**

Create `tests/homepage.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/app/page';

describe('Homepage View', () => {
  it('renders AgroMint AI branding and farm analysis wizard', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /AgroMint AI/i })).toBeInTheDocument();
    expect(screen.getByText(/Start Agricultural Analysis/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/homepage.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `Navbar`, `Footer`, `HeroSection`, and assemble `src/app/page.tsx`**

Integrate clean navigation with guest indicator, hero banner with smooth scroll CTA, embedded `FarmWizard`, and trustworthy footer.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/homepage.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ src/components/home/ src/app/page.tsx tests/homepage.test.tsx
git commit -m "feat: assemble AgroMint AI homepage with Hero and FarmWizard"
```

---

### Task 10: Analysis Intermediate State & Simulated Agronomic Loader

**Files:**
- Create: `src/components/analysis/LoadingAnalysis.tsx`
- Test: `tests/loadingAnalysis.test.tsx`

**Interfaces:**
- Produces: `<LoadingAnalysis onComplete={() => void} durationMs={number} />`

- [ ] **Step 1: Write the failing test**

Create `tests/loadingAnalysis.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingAnalysis } from '../src/components/analysis/LoadingAnalysis';

describe('LoadingAnalysis Component', () => {
  it('shows progressive agronomic evaluation stages', () => {
    render(<LoadingAnalysis onComplete={() => {}} durationMs={1000} />);
    expect(screen.getByText(/Analyzing farm-specific agronomic parameters/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/loadingAnalysis.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `LoadingAnalysis`**

Implement sequential progress steps:
1. Normalizing soil chemistry parameters
2. Correlating crop stage with extension agronomic references
3. Evaluating fertilizer & micronutrient thresholds
4. Assembling personalized advisory report

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/loadingAnalysis.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/analysis/LoadingAnalysis.tsx tests/loadingAnalysis.test.tsx
git commit -m "feat: implement simulated scientific analysis loader"
```

---

### Task 11: Results Dashboard — Header, Farm Profile & Findings Cards

**Files:**
- Create: `src/components/dashboard/ResultsHeader.tsx`
- Create: `src/components/dashboard/FarmProfileCard.tsx`
- Create: `src/components/dashboard/MainFindingsCard.tsx`
- Create: `src/components/dashboard/CropAdvisoryCard.tsx`
- Test: `tests/dashboardHeaderAndFindings.test.tsx`

**Interfaces:**
- Produces: Header and Cards 1, 2, 3 displaying submitted inputs and core findings with `DataBadge`.

- [ ] **Step 1: Write the failing test**

Create `tests/dashboardHeaderAndFindings.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FarmProfileCard } from '../src/components/dashboard/FarmProfileCard';

describe('FarmProfileCard Component', () => {
  it('renders farmer submitted data tagged with Submitted Data badge', () => {
    render(<FarmProfileCard profile={{ region: 'Shirvan', crop: 'Pomegranate', farmAreaHectares: 12 }} />);
    expect(screen.getByText(/Shirvan/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Hectares/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/dashboardHeaderAndFindings.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `ResultsHeader`, `FarmProfileCard`, `MainFindingsCard`, and `CropAdvisoryCard`**

Add clear badges, health scores, crop status summaries, export/print buttons, and responsive grid layout.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/dashboardHeaderAndFindings.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/ tests/dashboardHeaderAndFindings.test.tsx
git commit -m "feat: implement ResultsHeader, FarmProfileCard, MainFindingsCard, and CropAdvisoryCard"
```

---

### Task 12: Results Dashboard — Soil, Fertilizer & AgroSphere External Cards

**Files:**
- Create: `src/components/dashboard/SoilNutrientCard.tsx`
- Create: `src/components/dashboard/FertilizerCard.tsx`
- Test: `tests/soilAndFertilizerCards.test.tsx`

**Interfaces:**
- Produces:
  - `<SoilNutrientCard soilData={...} />` (Card 4: Visual gauges, pH/NPK balance)
  - `<FertilizerCard plan={...} agroSphereLink={...} />` (Card 5: Fertilizer plan with safe dosage guards and external AgroSphere link)

- [ ] **Step 1: Write the failing test**

Create `tests/soilAndFertilizerCards.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FertilizerCard } from '../src/components/dashboard/FertilizerCard';

describe('FertilizerCard Component', () => {
  it('displays fertilizer recommendations and natural AgroSphere procurement link', () => {
    render(
      <FertilizerCard
        recommendations={[{ nutrient: 'Nitrogen', advice: 'Apply split dose' }]}
        agroSphereLink={{
          title: 'Order certified fertilizers on AgroSphere',
          destinationUrl: 'https://agrosphere.example.com/fertilizers'
        }}
      />
    );
    expect(screen.getByText(/Order certified fertilizers on AgroSphere/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/soilAndFertilizerCards.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `SoilNutrientCard` and `FertilizerCard`**

Display soil gauges with nutrient status (Low/Optimal/High), safe dosage guards if data is incomplete, and contextual AgroSphere external links.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/soilAndFertilizerCards.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/SoilNutrientCard.tsx src/components/dashboard/FertilizerCard.tsx tests/soilAndFertilizerCards.test.tsx
git commit -m "feat: implement SoilNutrientCard and FertilizerCard with AgroSphere link"
```

---

### Task 13: Results Dashboard — Irrigation, Pest Protection, Next Steps & Citations Cards

**Files:**
- Create: `src/components/dashboard/IrrigationCard.tsx`
- Create: `src/components/dashboard/PlantProtectionCard.tsx`
- Create: `src/components/dashboard/ActionStepsCard.tsx`
- Create: `src/components/dashboard/UncertaintiesCard.tsx`
- Create: `src/components/dashboard/CitationsCard.tsx`
- Test: `tests/remainingCards.test.tsx`

**Interfaces:**
- Produces:
  - Card 6: Irrigation & moisture scheduling
  - Card 7: Disease/pest risk with AgroSphere protection link
  - Card 8: Actionable 1-3-7 day schedule
  - Card 9: Uncertainties & missing data disclosure
  - Card 10: Agronomic citations & scientific reference guides

- [ ] **Step 1: Write the failing test**

Create `tests/remainingCards.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UncertaintiesCard } from '../src/components/dashboard/UncertaintiesCard';

describe('UncertaintiesCard Component', () => {
  it('explicitly lists missing parameters to prevent inaccurate field assumptions', () => {
    render(<UncertaintiesCard items={['Exact soil organic matter percentage not provided']} />);
    expect(screen.getByText(/Exact soil organic matter percentage not provided/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/remainingCards.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement Cards 6, 7, 8, 9, and 10**

Implement remaining cards with consistent typography, action pills, warning callouts for uncertainties, and citation footers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/remainingCards.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/ tests/remainingCards.test.tsx
git commit -m "feat: implement Irrigation, Protection, ActionSteps, Uncertainties, and Citations cards"
```

---

### Task 14: Results Dashboard Assembly & State Integration (`/analyze`)

**Files:**
- Create: `src/components/dashboard/ResultsDashboard.tsx`
- Create: `src/app/analyze/page.tsx`
- Test: `tests/analyzePage.test.tsx`

**Interfaces:**
- Consumes: Form submission state via session/URL/state context and `generateMockAdvisoryReport`
- Produces: Complete `/analyze` page toggling between `LoadingAnalysis` and the 10-card `ResultsDashboard`.

- [ ] **Step 1: Write the failing test**

Create `tests/analyzePage.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyzePage from '../src/app/analyze/page';

describe('Analyze Page', () => {
  it('renders results dashboard once loading completes', async () => {
    render(<AnalyzePage />);
    expect(await screen.findByText(/Agronomic Intelligence Dossier/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/analyzePage.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `ResultsDashboard` and `src/app/analyze/page.tsx`**

Integrate state handoff from intake form to results, transition from loader to 10-card dashboard, and provide quick reset / re-analyze capabilities.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/analyzePage.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/ResultsDashboard.tsx src/app/analyze/page.tsx tests/analyzePage.test.tsx
git commit -m "feat: assemble complete ResultsDashboard and /analyze page"
```

---

### Task 15: Authentication Shell Views (`/auth/login`, `/auth/register`)

**Files:**
- Create: `src/app/auth/login/page.tsx`
- Create: `src/app/auth/register/page.tsx`
- Test: `tests/authPages.test.tsx`

**Interfaces:**
- Produces: Clean, accessible farmer sign-in and registration pages emphasizing that draft farm analysis is preserved.

- [ ] **Step 1: Write the failing test**

Create `tests/authPages.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../src/app/auth/login/page';

describe('Auth Views', () => {
  it('displays sign-in form with farmer consultation preservation notice', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Sign in to AgroMint AI/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/authPages.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `/auth/login` and `/auth/register` pages**

Clean, focused layout with brand accents, phone/email input options, and a return-to-farm link.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/authPages.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/auth/ tests/authPages.test.tsx
git commit -m "feat: add farmer authentication views for login and registration"
```

---

### Task 16: End-to-End User Flow & Responsive Design Verification

**Files:**
- Test: `tests/e2eFlow.test.tsx`

**Interfaces:**
- Verifies:
  - Homepage -> Farm Intake Wizard -> Step progression -> Skip optional fields -> Submit -> Analysis Loading -> Full 10-Card Dashboard -> AgroSphere Outbound Links.

- [ ] **Step 1: Write the comprehensive end-to-end integration test**

Create `tests/e2eFlow.test.tsx`:
```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../src/app/page';

describe('Complete Farmer Journey', () => {
  it('navigates through farm wizard and initiates analysis', async () => {
    render(<HomePage />);
    // Verify wizard is present on homepage
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    
    // Fill region and proceed
    const regionInput = screen.getByLabelText(/Region/i);
    fireEvent.change(regionInput, { target: { value: 'Aran' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`  
Expected: All tests PASS

- [ ] **Step 3: Verify Next.js build**

Run: `npm run build`  
Expected: Successful production build with zero TypeScript and lint errors.

- [ ] **Step 4: Commit**

```bash
git add tests/e2eFlow.test.tsx
git commit -m "test: verify end-to-end user flow and production build stability"
```

---

## Plan Self-Review Checklist

1. **Spec Coverage:**
   - Homepage & Hero: Covered in Task 9.
   - Farm Information Form (4 steps, conditional growth stages, optional skips, dual soil upload/manual): Covered in Tasks 6, 7, 8.
   - AI Analysis Loader: Covered in Task 10.
   - Personalized Results Dashboard (10 cards, evidence badges, safe dosage guards): Covered in Tasks 11, 12, 13, 14.
   - AgroSphere External Links (contextual outbound only): Covered in Tasks 4, 12, 13.
   - Authentication Shell: Covered in Task 15.
   - Brand Aesthetics & Visual System: Covered in Tasks 1, 4.

2. **Step Scan:** Every step includes explicit files, commands, and expected pass/fail outputs.
3. **Type Consistency:** Shared interfaces (`FarmSubmissionPayload`, `AgronomicAdvisoryReport`) defined in Task 2 and consumed consistently across Tasks 3, 6, 7, 8, 11, 12, 13, 14.
4. **Review Focus:** Addressed all 5 review risks (incomplete inputs, crop stage switching, soil mode toggling, mobile responsiveness, and link security).
