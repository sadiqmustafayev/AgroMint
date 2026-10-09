# Local Agronomic RAG Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate a lightweight, fast Retrieval-Augmented Generation (RAG) subsystem grounded in Azerbaijani agronomy textbooks from `C:\Users\Hesen\Desktop\aqranom layiheler` into AgroMint AI's analysis report pipeline.

**Architecture:** An extraction utility digests desktop textbooks into structured JSON knowledge chunks (`src/data/agronomyKnowledgeBase.json`). An in-process scoring engine (`src/lib/ragService.ts`) retrieves top relevant passages at query time and injects them into Gemini's advisory prompt (`src/lib/geminiAdvisor.ts`), populating authentic local textbook citations on the results dashboard.

**Tech Stack:** TypeScript, Next.js 14, Python 3.13 (extraction helper), Vitest, TailwindCSS.

**Spec:** [`docs/superpowers/specs/2026-10-09-rag-agronomy-advisor-design.md`](file:///c:/Users/Hesen/Documents/antigravity/peaceful-turing/docs/superpowers/specs/2026-10-09-rag-agronomy-advisor-design.md)

## Global Constraints

- **Knowledge Bank format:** JSON array of objects conforming to `KnowledgeChunk` interface.
- **Retrieval Performance:** Sub-10ms in-process scoring, zero external network dependency for retrieval.
- **Model Grounding:** Gemini prompt must instruct the model to ground recommendations and populate `scientificCitations` with actual retrieved textbook titles and authors.
- **Language support:** Azerbaijani (`az`) primary, English (`en`) secondary.

## Review Focus

1. **Unmatched / generic crop:** When a farmer enters an uncommon crop, the retrieval engine must fall back to general soil/fertilizer agronomy principles without throwing.
2. **Missing Desktop folder at runtime:** The Next.js application must depend only on the bundled `agronomyKnowledgeBase.json`, ensuring full functionality anywhere.
3. **Empty user problem field:** When `mainProblem` is blank or minimal, retrieval must still supply relevant phenology and nutrient advice for the crop and soil type.
4. **Citation structure fidelity:** Retrieved citations must conform strictly to the existing `scientificCitations` schema (`title`, `source`, `year`, `relevance`).
5. **No latency regression:** Overall analysis turnaround must remain under 10 seconds.

---

### Task 1: Knowledge Base Extraction & JSON Knowledge Bank

**Files:**
- Create: `scripts/extract_desktop_docs.py`
- Create: `src/data/agronomyKnowledgeBase.json`
- Test: `tests/knowledgeBaseData.test.ts`

**Interfaces:**
- Produces: `src/data/agronomyKnowledgeBase.json` containing an array of `KnowledgeChunk`:
  ```typescript
  interface KnowledgeChunk {
    id: string;
    title: string;
    author: string;
    year: number;
    category: 'crop_management' | 'fertilizer' | 'irrigation' | 'plant_protection' | 'soil_science';
    crops: string[];
    keywords: string[];
    content: string;
  }
  ```

- [ ] **Step 1: Write the failing test for knowledge base integrity**

```typescript
import { describe, it, expect } from 'vitest';
import knowledgeBase from '../src/data/agronomyKnowledgeBase.json';

describe('Agronomy Knowledge Base Dataset', () => {
  it('contains at least 25 structured agronomic knowledge chunks', () => {
    expect(Array.isArray(knowledgeBase)).toBe(true);
    expect(knowledgeBase.length).toBeGreaterThanOrEqual(25);
  });

  it('contains key Azerbaijani agronomy textbooks with valid fields', () => {
    const bitkichilik = knowledgeBase.find((c: any) => c.title.includes('Bitkiçilik'));
    expect(bitkichilik).toBeDefined();
    expect(bitkichilik.author).toContain('Məmmədov');
    expect(bitkichilik.content.length).toBeGreaterThan(50);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/knowledgeBaseData.test.ts`  
Expected: FAIL (file or module `agronomyKnowledgeBase.json` not found).

- [ ] **Step 3: Implement extraction script and generate `src/data/agronomyKnowledgeBase.json`**

Write `scripts/extract_desktop_docs.py` to scan `C:\Users\Hesen\Desktop\aqranom layiheler`, extract key chapters from *Bitkiçilik (dərslik)*, *Kompleks gübrələr*, *Torpaqşünaslıq mühazirələri*, *Yağış yağdırma üsulu ilə suvarma*, and *Torpaq resursları*, and output structured JSON to `src/data/agronomyKnowledgeBase.json`. Run the script with `python scripts/extract_desktop_docs.py`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/knowledgeBaseData.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/extract_desktop_docs.py src/data/agronomyKnowledgeBase.json tests/knowledgeBaseData.test.ts
git commit -m "feat: extract and build local agronomy knowledge base from desktop textbooks"
```

---

### Task 2: In-Process RAG Retrieval Engine

**Files:**
- Create: `src/lib/ragService.ts`
- Create: `tests/ragService.test.ts`

**Interfaces:**
- Consumes: `src/data/agronomyKnowledgeBase.json`, `FarmSubmissionPayload`
- Produces:
  ```typescript
  export function retrieveAgronomicContext(
    payload: Partial<FarmSubmissionPayload>,
    limit?: number
  ): RetrievedReference[];
  ```

- [ ] **Step 1: Write the failing test for retrieval engine**

```typescript
import { describe, it, expect } from 'vitest';
import { retrieveAgronomicContext } from '../src/lib/ragService';

describe('RAG Retrieval Service', () => {
  it('retrieves cotton weed and boll maturation literature for cotton farmer with weed infestation', () => {
    const results = retrieveAgronomicContext({
      crop: 'Cotton',
      mainProblem: 'Alaq otları sahəni basıb, qozaların açılması ləngiyir',
      soilType: 'Loamy',
    }, 4);

    expect(results.length).toBeGreaterThanOrEqual(1);
    const topResult = results[0];
    expect(topResult.score).toBeGreaterThan(0);
    expect(topResult.chunk.crops).toContain('Cotton');
    expect(topResult.chunk.title).toContain('Bitkiçilik');
  });

  it('retrieves complex fertilizer guidelines when farmer asks about nitrogen and potassium rates', () => {
    const results = retrieveAgronomicContext({
      crop: 'Wheat',
      mainProblem: 'Karbamid yemləmə normasının və kompleks gübrələrin təyini',
    }, 3);

    expect(results.some(r => r.chunk.category === 'fertilizer')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ragService.test.ts`  
Expected: FAIL (module `ragService` not found).

- [ ] **Step 3: Implement `src/lib/ragService.ts`**

Implement scoring algorithm based on crop weight, problem keyword matching (Azerbaijani stemming/tokenization), category alignment, and score sorting.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ragService.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ragService.ts tests/ragService.test.ts
git commit -m "feat: implement in-process agronomic RAG retrieval service"
```

---

### Task 3: Ground Gemini Advisor Prompt & Scientific Citations with RAG

**Files:**
- Modify: `src/lib/geminiAdvisor.ts`
- Modify: `src/lib/mockAdvisory.ts`
- Create: `tests/ragIntegration.test.ts`

**Interfaces:**
- Consumes: `retrieveAgronomicContext` from `src/lib/ragService.ts`
- Produces: Augmented Gemini prompt and real textbook citations in `report.scientificCitations`.

- [ ] **Step 1: Write the failing test for RAG prompt augmentation and citations grounding**

```typescript
import { describe, it, expect } from 'vitest';
import { generateGeminiAdvisoryReport } from '../src/lib/geminiAdvisor';
import { getFallback7DayWeather } from '../src/lib/weatherService';

describe('Gemini Advisor RAG Integration', () => {
  it('incorporates retrieved Azerbaijani textbook citations into the report', async () => {
    const weather = getFallback7DayWeather({ lat: 40.6, lon: 47.1, name: 'Aran' }, 'az');
    const { report } = await generateGeminiAdvisoryReport(
      { crop: 'Cotton', mainProblem: 'Alaq otları və gübrələmə norması', region: 'Aran' },
      weather,
      'az'
    );

    expect(report.scientificCitations.length).toBeGreaterThanOrEqual(1);
    const citation = report.scientificCitations[0];
    expect(citation.title).toMatch(/Bitkiçilik|Gübrə|Torpaq/);
    expect(citation.source).toBeTruthy();
  }, 25000);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ragIntegration.test.ts`  
Expected: FAIL (citations do not reference local textbooks or mock citations default).

- [ ] **Step 3: Inject RAG context into `src/lib/geminiAdvisor.ts` and `src/lib/mockAdvisory.ts`**

Retrieve top RAG references via `retrieveAgronomicContext(payload)` and format them into an `ACADEMIC AGRONOMY REFERENCES (RAG)` block inside `geminiAdvisor.ts`. Instruct Gemini to populate `scientificCitations` with these exact books. In `mockAdvisory.ts`, map top RAG references into `scientificCitations`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ragIntegration.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/geminiAdvisor.ts src/lib/mockAdvisory.ts tests/ragIntegration.test.ts
git commit -m "feat: ground Gemini advisor prompt and citations in retrieved agronomy textbooks"
```

---

### Task 4: UI Grounding Attribution & Citations Card Enhancement

**Files:**
- Modify: `src/components/dashboard/CitationsCard.tsx`
- Create: `tests/citationsCardRAG.test.tsx`

**Interfaces:**
- Consumes: `report.scientificCitations`
- Produces: Enhanced UI displaying real book authors, years, and a "Yerli Elmi Ədəbiyyat İnteqrasiyası" badge.

- [ ] **Step 1: Write the failing test for CitationsCard RAG styling**

```typescript
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CitationsCard } from '../src/components/dashboard/CitationsCard';
import { LanguageProvider } from '../src/i18n/LanguageContext';

describe('CitationsCard RAG Attribution', () => {
  it('displays Azerbaijani textbook citation with RAG grounding badge', () => {
    const citations = [
      {
        title: 'Bitkiçilik (dərslik)',
        source: 'Q.Y. Məmmədov, M.M. İsmayılov',
        year: 2018,
        relevance: 'Pambıq becərilməsində alaq otlarına qarşı herbisid normaları',
      },
    ];

    render(
      <LanguageProvider defaultLanguage="az">
        <CitationsCard citations={citations} />
      </LanguageProvider>
    );

    expect(screen.getByText('Bitkiçilik (dərslik)')).toBeInTheDocument();
    expect(screen.getByText(/Q.Y. Məmmədov/)).toBeInTheDocument();
    expect(screen.getByText('RAG • Yerli Elmi Ədəbiyyat')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/citationsCardRAG.test.tsx`  
Expected: FAIL (badge "RAG • Yerli Elmi Ədəbiyyat" not found).

- [ ] **Step 3: Update `src/components/dashboard/CitationsCard.tsx`**

Add the RAG academic grounding badge and polish author/year display.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/citationsCardRAG.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/CitationsCard.tsx tests/citationsCardRAG.test.tsx
git commit -m "feat: enhance citations card with RAG textbook grounding indicator"
```

---

### Task 5: Full Test Suite & Production Build Verification

**Files:**
- Entire codebase

- [ ] **Step 1: Run full test suite**

Run: `npm test`  
Expected: All test files pass with 0 failures.

- [ ] **Step 2: Run production build**

Run: `npm run build`  
Expected: Next.js compilation succeeds with exit code 0.

- [ ] **Step 3: Commit and summarize**

```bash
git status
```
Verify clean git tree.
