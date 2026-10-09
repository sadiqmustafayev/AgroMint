import knowledgeBaseData from '../data/agronomyKnowledgeBase.json';
import { FarmSubmissionPayload } from '../types/farm';

export type AgronomyCategory =
  | 'crop_management'
  | 'fertilizer'
  | 'irrigation'
  | 'plant_protection'
  | 'soil_science';

export interface KnowledgeChunk {
  id: string;
  title: string;
  author: string;
  year: number;
  category: AgronomyCategory | string;
  crops: string[];
  keywords: string[];
  content: string;
}

export interface RetrievedReference {
  chunk: KnowledgeChunk;
  score: number;
}

const knowledgeBase: KnowledgeChunk[] = knowledgeBaseData as KnowledgeChunk[];

const CROP_SYNONYMS: Record<string, string[]> = {
  cotton: ['cotton', 'pambıq', 'pambıqçılıq'],
  wheat: ['wheat', 'buğda', 'taxıl', 'dənli'],
  barley: ['barley', 'arpa', 'dənli'],
  corn: ['corn', 'qarğıdalı', 'qarğadalı', 'maize'],
  tomato: ['tomato', 'pomidor', 'tərəvəz', 'tomat'],
  potato: ['potato', 'kartof', 'yumru'],
  grapes: ['grapes', 'üzüm', 'üzümçülük', 'tənək'],
  apple: ['apple', 'alma', 'meyvə'],
  alfalfa: ['alfalfa', 'yonca', 'yem'],
  sunflower: ['sunflower', 'günəbaxan']
};

const SOIL_SYNONYMS: Record<string, string[]> = {
  sandy: ['qumsal', 'qum', 'sandy'],
  loamy: ['gillicəli', 'tinli', 'loamy', 'orta gillicəli', 'yüngül gillicəli'],
  clay: ['gilli', 'gil', 'clay', 'ağır gillicəli'],
  silt: ['lilli', 'tozlu', 'silt'],
  peaty: ['torflu', 'peaty'],
  chalky: ['əhəngli', 'chalky']
};

const CATEGORY_TRIGGERS: Record<string, string[]> = {
  fertilizer: [
    'gübrə', 'gübrələmə', 'yemləmə', 'azot', 'fosfor', 'kalium', 'karbamid',
    'ammofos', 'nitroammofoska', 'npk', 'fertilizer', 'qidalanma', 'norma'
  ],
  plant_protection: [
    'alaq', 'alaq otları', 'zərərverici', 'xəstəlik', 'pestisid', 'herbisid',
    'funqisid', 'insektisid', 'sovkası', 'həşərat', 'defoliasiya', 'çürümə',
    'pas', 'unlu şeh', 'dərman', 'protection'
  ],
  irrigation: [
    'su', 'suvarma', 'nəmlik', 'rütubət', 'yağış', 'damlama', 'şırım',
    'yağmurlama', 'irrigation', 'quraqlıq', 'su norması'
  ],
  soil_science: [
    'torpaq', 'şoran', 'şorlaşma', 'humus', 'münbitlik', 'eroziya',
    'gillicəli', 'qumsal', 'şum', 'ph', 'drenaj', 'soil'
  ],
  crop_management: [
    'səpin', 'becərmə', 'yığım', 'qulluq', 'vegetasiya', 'kollanma',
    'qönçələmə', 'budama', 'şitil', 'məhsuldarlıq', 'management'
  ]
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9əöüığçşƏÖÜIĞÇŞ]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length >= 2);
}

export function retrieveAgronomicContext(
  payload: Partial<FarmSubmissionPayload>,
  limit: number = 4
): RetrievedReference[] {
  if (limit <= 0) {
    return [];
  }

  const crop = payload.crop?.trim().toLowerCase() || '';
  const mainProblem = payload.mainProblem?.trim().toLowerCase() || '';
  const soilType = payload.soilType?.trim().toLowerCase() || '';
  const growthStage = payload.growthStage?.trim().toLowerCase() || '';
  const region = payload.region?.trim().toLowerCase() || '';

  // Gather expanded user terms
  const userTextParts: string[] = [
    mainProblem,
    crop,
    soilType,
    growthStage,
    region
  ].filter(Boolean);

  // Add soil synonyms if present
  if (soilType) {
    for (const [key, synonyms] of Object.entries(SOIL_SYNONYMS)) {
      if (soilType.includes(key) || synonyms.some(s => soilType.includes(s))) {
        userTextParts.push(...synonyms);
      }
    }
  }

  // Add crop synonyms if present
  if (crop) {
    for (const [key, synonyms] of Object.entries(CROP_SYNONYMS)) {
      if (crop.includes(key) || synonyms.some(s => crop.includes(s))) {
        userTextParts.push(...synonyms);
      }
    }
  }

  const combinedUserText = userTextParts.join(' ').toLowerCase();
  const userTokens = Array.from(new Set(tokenize(combinedUserText)));

  // Identify targeted categories from query terms
  const detectedCategories = new Set<string>();
  for (const [category, triggers] of Object.entries(CATEGORY_TRIGGERS)) {
    if (triggers.some(trig => combinedUserText.includes(trig))) {
      detectedCategories.add(category);
    }
  }

  const scored: RetrievedReference[] = knowledgeBase.map(chunk => {
    let score = 0;
    const chunkCropsLower = chunk.crops.map(c => c.toLowerCase());
    const chunkKeywordsLower = chunk.keywords.map(k => k.toLowerCase());
    const chunkContentLower = chunk.content.toLowerCase();
    const chunkTitleLower = chunk.title.toLowerCase();

    // 1. Crop Match
    if (crop) {
      const cropMatch = chunkCropsLower.some(c => {
        if (c === crop) return true;
        for (const synonyms of Object.values(CROP_SYNONYMS)) {
          if (synonyms.includes(crop) && synonyms.includes(c)) return true;
        }
        return false;
      });

      if (cropMatch) {
        score += 30;
      } else if (chunkCropsLower.includes('general')) {
        score += 10;
      } else {
        // Chunk is for a different specific crop
        score -= 15;
      }
    } else {
      if (chunkCropsLower.includes('general')) {
        score += 5;
      }
    }

    // 2. Category Match
    if (detectedCategories.has(chunk.category)) {
      score += 15;
    }

    // 3. Keyword phrase match against mainProblem / user text
    for (const kw of chunkKeywordsLower) {
      if (combinedUserText.includes(kw)) {
        if (kw.includes(' ')) {
          // Multi-word exact match (e.g., "alaq otları", "qozaların açılması")
          score += 18;
        } else {
          score += 8;
        }
      }
    }

    // 4. Token match across keywords, title, and content
    let contentMatchCount = 0;
    for (const token of userTokens) {
      if (chunkKeywordsLower.some(kw => kw.includes(token))) {
        score += 4;
      }
      if (chunkTitleLower.includes(token)) {
        score += 3;
      }
      if (chunkContentLower.includes(token)) {
        contentMatchCount++;
      }
    }
    // Cap content match bonus to avoid bias toward longer passages
    score += Math.min(contentMatchCount * 1.5, 12);

    return {
      chunk,
      score: Math.max(0, Math.round(score * 10) / 10)
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // If top scores are > 0, return top matching results
  const positiveScored = scored.filter(r => r.score > 0);
  if (positiveScored.length >= 1) {
    return positiveScored.slice(0, limit);
  }

  // Fallback: If no chunks scored > 0 (e.g. empty input or obscure query),
  // return general agronomic literature with baseline score of 1.0
  const fallbacks = scored
    .filter(r => r.chunk.crops.map(c => c.toLowerCase()).includes('general'))
    .slice(0, limit)
    .map(r => ({ ...r, score: 1.0 }));

  if (fallbacks.length > 0) {
    return fallbacks;
  }

  return scored.slice(0, limit).map(r => ({ ...r, score: 1.0 }));
}
