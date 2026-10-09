# Design Specification: Local Agronomic RAG Pipeline

**Date:** 2026-10-09  
**Feature:** Retrieval-Augmented Generation (RAG) Grounded in Azerbaijani Agronomic Textbooks  
**Status:** Approved for Implementation  

---

## 1. Executive Summary

AgroMint AI currently generates personalized advisory reports using Google Gemini combined with 7-day weather forecasts. This specification designs a lightweight, fast, in-process Retrieval-Augmented Generation (RAG) pipeline grounded in Azerbaijani agronomic literature located at `C:\Users\Hesen\Desktop\aqranom layiheler`.

The RAG pipeline extracts and indexes key agricultural textbooks (notably *Bitkiçilik (dərslik)* by Q.Y. Məmmədov and M.M. İsmayılov, *Kompleks gübrələr*, *Torpaqşünaslıq mühazirələri*, and *Suvarma üsulları*), matches relevant passages against farmer input at query time, and injects authoritative excerpts into Gemini's prompt. The generated report grounds diagnoses, fertilizer rates, and scientific citations directly in local Azerbaijani agricultural science.

---

## 2. Architecture & Data Flow

```
Farmer Submits Farm Form (Crop, Soil, Region, Problem, Weather)
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │   RAG Retrieval Engine (ragService.ts)        │
        │   - Matches crop, problem keywords, and soil  │
        │   - Queries pre-indexed knowledge base        │
        │     (src/data/agronomyKnowledgeBase.json)     │
        └───────────────────────┬───────────────────────┘
                                │ Top 3-5 Authoritative Passages
                                ▼
        ┌───────────────────────────────────────────────┐
        │   Gemini Agronomic Advisor (geminiAdvisor.ts) │
        │   - Prompt injected with live Weather + RAG   │
        │   - Grounds prescriptions in local textbooks  │
        │   - Populates scientificCitations with books  │
        └───────────────────────┬───────────────────────┘
                                │ Structured Report
                                ▼
        ┌───────────────────────────────────────────────┐
        │   Results Dashboard                           │
        │   - Citations Card: Real textbook references  │
        │   - Live Gemini AI & RAG Attribution Badges   │
        └───────────────────────────────────────────────┘
```

---

## 3. Detailed Component Design

### 3.1 Knowledge Base Extraction (`scripts/extract_desktop_docs.py` & `src/data/agronomyKnowledgeBase.json`)
A Python extraction utility scans `C:\Users\Hesen\Desktop\aqranom layiheler`, extracts text from `.docx` and `.doc` files, and formats key agronomic concepts into structured JSON chunks:
- `id`: string (unique chunk identifier)
- `title`: string (book or lecture title, e.g. "Bitkiçilik (dərslik)")
- `author`: string (e.g. "Q.Y. Məmmədov, M.M. İsmayılov")
- `year`: number (e.g. 2018)
- `category`: 'crop_management' | 'fertilizer' | 'irrigation' | 'plant_protection' | 'soil_science'
- `crops`: string[] (e.g. ["Cotton", "Wheat", "Tomato", "Barley", "General"])
- `keywords`: string[] (Azerbaijani agricultural keywords, e.g. ["alaq", "karbamid", "suvarma", "xloroz", "defoliasiya", "azot"])
- `content`: string (authoritative excerpt with specific agronomic guidance, dosages, and biological mechanisms)

### 3.2 Retrieval Engine (`src/lib/ragService.ts`)
A lightweight, fast (<5ms) in-process retrieval function:
```typescript
export interface KnowledgeChunk {
  id: string;
  title: string;
  author: string;
  year: number;
  category: string;
  crops: string[];
  keywords: string[];
  content: string;
}

export interface RetrievedReference {
  chunk: KnowledgeChunk;
  score: number;
}

export function retrieveAgronomicContext(
  payload: Partial<FarmSubmissionPayload>,
  limit?: number
): RetrievedReference[];
```

**Scoring Strategy:**
1. **Crop Match:** Chunks matching `payload.crop` (or marked as `General`) receive +10 points.
2. **Problem Keywords:** User's `mainProblem` is normalized and matched against chunk keywords and content tokens (+5 points per keyword match).
3. **Soil & Growth Stage:** Matches with `payload.soilType` or `payload.growthStage` receive +3 points.
4. Returns the top `limit` (default 4) scored passages.

### 3.3 Advisor Prompt Augmentation (`src/lib/geminiAdvisor.ts`)
The retrieved chunks are formatted into a markdown section in the Gemini prompt:
```text
ACADEMIC AGRONOMY TEXTBOOK REFERENCES (RAG - LOCAL SCIENTIFIC KNOWLEDGE BASE):
Reference 1: "[Title]" by [Author] ([Year])
Summary: [Content excerpt]

Reference 2: "[Title]" by [Author] ([Year])
Summary: [Content excerpt]

CRITICAL RAG GROUNDING INSTRUCTION:
You MUST directly incorporate findings and recommendations from these local textbook references:
- In "scientificCitations": cite these specific textbooks with exact title, author, year, and relevance.
- In "fertilizerAdvisory" and "plantProtection": harmonize your medication and fertilizer advice with the dosages and agrotechnical practices specified in the reference excerpts.
```

### 3.4 Scientific Citations Card (`src/components/dashboard/CitationsCard.tsx`)
Update `CitationsCard.tsx` to display:
- Real citations populated from the retrieved textbooks.
- A badge/indicator indicating grounding in Azerbaijani agronomic literature (*Yerli Elmi Ədəbiyyat İnteqrasiyası*).

---

## 4. Error Handling & Resilience
- **Offline / Missing Desktop Directory:** The processed knowledge base (`src/data/agronomyKnowledgeBase.json`) is committed inside the repository. The running application does not require runtime access to the Desktop folder once the knowledge bank is built.
- **Empty Query / No Match:** If no specific problem keywords match, the retrieval engine defaults to top general guidance for the selected crop and regional soil type.
- **Gemini Fallback:** If Gemini fails or times out, the resilient rules engine continues to operate and also incorporates the retrieved textbook references into citations.

---

## 5. Verification & Testing
1. **Unit Test (`tests/ragService.test.ts`):** Verify retrieval engine returns top relevant chunks for cotton, wheat, weeds, nitrogen deficiency, and soil salinity.
2. **Integration Test (`tests/geminiAdvisorLive.test.ts`):** Verify that live Gemini report generation receives RAG context and populates `scientificCitations` with actual local book titles (e.g. *Bitkiçilik*, *Kompleks gübrələr*).
3. **Full Suite (`npm test`):** All test files must pass.
4. **Production Build (`npm run build`):** Must compile with 0 errors.
