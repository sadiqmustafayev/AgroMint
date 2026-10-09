import { FarmSubmissionPayload } from '../types/farm';
import { AgronomicAdvisoryReport } from '../types/advisory';
import { SevenDayWeatherData } from './weatherService';
import { generateMockAdvisoryReport, calculateDynamicHealthScore } from './mockAdvisory';
import { retrieveAgronomicContext } from './ragService';

const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
];

export async function generateGeminiAdvisoryReport(
  payload: Partial<FarmSubmissionPayload>,
  weather: SevenDayWeatherData,
  lang: 'en' | 'az' = 'en'
): Promise<{ report: AgronomicAdvisoryReport; source: 'gemini' | 'rules-engine' }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. Falling back to rules engine.');
    const fallback = generateMockAdvisoryReport(payload, lang, weather);
    fallback.source = 'rules-engine';
    return {
      report: fallback,
      source: 'rules-engine',
    };
  }

  const isAz = lang === 'az';
  const hasSoilMetrics = Boolean(
    payload.soilMetrics &&
      (payload.soilMetrics.ph !== undefined ||
        payload.soilMetrics.nitrogenPpm !== undefined)
  );

  const ragReferences = retrieveAgronomicContext(payload, 4);

  const ragContextBlock = ragReferences.length > 0
    ? `
ACADEMIC AGRONOMY TEXTBOOK REFERENCES (RAG - LOCAL SCIENTIFIC KNOWLEDGE BASE):
${ragReferences
  .map(
    (ref, i) =>
      `Reference ${i + 1}: "${ref.chunk.title}" by ${ref.chunk.author} (${ref.chunk.year}) [Category: ${ref.chunk.category}]
Key Excerpt: ${ref.chunk.content}`
  )
  .join('\n\n')}

CRITICAL RAG GROUNDING INSTRUCTION:
You MUST directly ground your recommendations and populate citations using these local Azerbaijani agronomy textbook references:
- In "scientificCitations": cite these specific textbooks with exact title, author (as source), publication year, and relevance.
- In "fertilizerAdvisory" and "plantProtection": harmonize your medication, dosage, and agrotechnical prescriptions with the practices and standards specified in the reference excerpts.
`
    : '';

  const prompt = `You are AgroMint AI, an expert precision agronomy intelligence system.
Analyze the provided farm profile alongside the live 7-day meteorological forecast to generate a personalized agronomic advisory report.

CRITICAL INSTRUCTION:
You MUST integrate the 7-day weather forecast directly into your agricultural conclusions:
1. Irrigation: Adjust weekly water requirement (mm) based on total expected rainfall (${weather.summary.totalRainfallMm} mm). Advise on pump shutoff or frequency adjustments during rain days.
2. Fertilization: MUST provide SPECIFIC fertilizer product/chemical names (e.g. "Karbamid (Urea 46% N)", "Ammofos (12-52 MAP)", "Kalium Sulfat", "Diammofoska (10-26-26)", "Kalsium Nitrat", "NPK 15-15-15"). Warn against applying granular surface nitrogen immediately before high-probability rain days to prevent nitrate leaching.
3. Plant Protection & Specific Medications: MUST diagnose the primary problem (especially taking into account the user's reported problem in mainProblem such as weeds, insect pests, fungus, or chlorosis). For weeds (alaq otu), specify exact herbicide names (e.g., "Herbisid: Qlifosat 480 q/l (cərgəarası)", "Selektiv herbisid: Pendimetalin 330 EC", "2,4-D amin duzu") and provide clear step-by-step instructions on how to eradicate them! For insect pests: specify exact insecticides (e.g. "İnsektisid: İmidakloprid 200 q/l", "Asetamiprid 20 SP"). For diseases: specify exact fungicides (e.g. "Funqisid: Azoksistrobin + Difenokonazol", "Mis kuporosu / Bordos mayesi 1%").
4. Weather Synthesis: Provide clear agronomic synthesis (headline, summary, irrigationImpact, fertilizerImpact, protectionImpact, sprayWindowRecommendation).
5. Action Steps: Action 1 must be immediate (1-2 days) accounting for immediate weather and urgent problem intervention. Action 2 must be near-term (3-7 days). Action 3 for next growth phase.

CRITICAL DOSAGE & PRESCRIPTION SAFETY GUARDRAIL:
${hasSoilMetrics
  ? 'Field laboratory soil metrics are verified. Provide calibrated quantitative fertilizer rates in kg/ha based on nutrient deficits and set isGuardedEstimate to false.'
  : 'STRICT PROHIBITION: Certified laboratory soil data (N-P-K, pH) IS NOT PROVIDED in this farm profile. Under strict agronomic safety guardrails, you MUST NOT prescribe specific quantitative application rates (such as "X kg/ha" or "X kq/ha"). For "estimatedRate", provide qualitative guidance (e.g., "Laboratoriya analizi tələb olunur — Ehtiyatlı ilkin norma" in Azerbaijani or "Lab verification required prior to numeric dosing — Conservative baseline" in English) and set "isGuardedEstimate": true for all prescriptions.'}

FIELD IMAGERY & VISUAL TELEMETRY:
${payload.uploadedPhotoNames && payload.uploadedPhotoNames.length > 0
  ? `Field scouting photos attached: ${payload.uploadedPhotoNames.join(', ')}. Ingest this visual evidence to cross-verify canopy symptoms, weed pressure, and leaf lesions in diagnosedStressors.`
  : 'No field photographs attached. Note visual scouting requirement in actionSteps.'}
${ragContextBlock}
Language Requirement:
${isAz ? 'ALL user-facing text, titles, descriptions, diagnoses, and recommendations MUST be in natural Azerbaijani (az).' : 'ALL user-facing text, titles, descriptions, diagnoses, and recommendations MUST be in professional English (en).'}

Farm Profile:
${JSON.stringify(payload, null, 2)}

7-Day Weather Data:
${JSON.stringify(weather, null, 2)}

Respond with STRICTLY valid JSON conforming to this schema (no markdown, no backticks):
{
  "summaryDiagnosis": "${isAz ? 'Diaqnostik xülasə...' : 'Diagnostic summary...'}",
  "identifiedProblem": {
    "problemTitle": "${isAz ? 'Müəyyən edilmiş əsas problem (məs: Sahədə İntensiv Alaq Otu Basması)' : 'Identified core problem (e.g. Severe Weed Infestation)'}",
    "severity": "critical",
    "causeAnalysis": "${isAz ? 'Problemin yaranma səbəbi və risk təhlili...' : 'Cause and risk analysis...'}",
    "solutionPlan": "${isAz ? 'Problemin aradan qaldırılması üçün konkret tədbirlər və dərman/aqrotexniki həll yolu...' : 'Step-by-step solution plan with specific medicines/agrotechnical methods...'}"
  },
  "mainFindings": ["...", "...", "..."],
  "fertilizerAdvisory": {
    "safeDosageNotice": "...",
    "prescriptions": [
      {
        "nutrient": "Azot (N) / Fosfor (P) / Kalium (K)",
        "fertilizerType": "Dəqiq Gübrə Adı (Məs: Karbamid (Urea 46% N) və ya Ammofos 12-52)",
        "timing": "...",
        "estimatedRate": "${hasSoilMetrics ? '80-120 kg/ha' : isAz ? 'Laboratoriya analizi tələb olunur — Ehtiyatlı ilkin norma' : 'Lab verification required — Conservative baseline'}",
        "isGuardedEstimate": ${!hasSoilMetrics}
      }
    ]
  },
  "irrigationAdvisory": {
    "currentMethod": "${payload.irrigationMethod || 'Drip Irrigation'}",
    "recommendedFrequency": "...",
    "waterRequirementMmPerWeek": 26,
    "managementTips": ["...", "..."]
  },
  "plantProtection": {
    "diagnosedStressors": ["...", "..."],
    "preventativeControls": ["...", "..."],
    "organicInterventions": ["...", "..."],
    "specificTreatments": [
      {
        "targetIssue": "${isAz ? 'Alaq otları (və ya Zərərverici / Xəstəlik)' : 'Weeds (or Pests / Disease)'}",
        "medicineName": "${isAz ? 'Herbisid: Qlifosat 480 q/l (və ya Pendimetalin 330 EC)' : 'Herbicide: Glyphosate 480 g/L (or Pendimethalin 330 EC)'}",
        "applicationMethod": "${isAz ? '200-250 l/ha su ilə cərgəarasına qoruyucu başlıqla çiləmə' : 'Spray between rows using 200-250 L/ha water with drift shields'}"
      }
    ]
  },
  "actionSteps": [
    {
      "id": "act-1",
      "title": "...",
      "timeline": "Immediate (1-2 Days)",
      "description": "...",
      "importance": "critical"
    },
    {
      "id": "act-2",
      "title": "...",
      "timeline": "Near-term (3-7 Days)",
      "description": "...",
      "importance": "standard"
    },
    {
      "id": "act-3",
      "title": "...",
      "timeline": "Next Growth Phase",
      "description": "...",
      "importance": "preventative"
    }
  ],
  "uncertaintiesAndGaps": ["..."],
  "scientificCitations": [
    {
      "title": "${ragReferences[0]?.chunk.title || 'Bitkiçilik (dərslik)'}",
      "source": "${ragReferences[0]?.chunk.author || 'Q.Y. Məmmədov, M.M. İsmayılov'}",
      "year": ${ragReferences[0]?.chunk.year || 2018},
      "relevance": "${isAz ? 'Pambıq əkinlərində alaq otları ilə mübarizə və qozaların defoliasiyası üzrə elmi aqrotexniki norma.' : 'Scientific principles for weed management and crop maturation.'}"
    }
  ],
  "weatherSynthesis": {
    "headline": "...",
    "summary": "...",
    "irrigationImpact": "...",
    "fertilizerImpact": "...",
    "protectionImpact": "...",
    "sprayWindowRecommendation": "..."
  }
}`;

  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`Gemini model ${model} returned HTTP ${res.status}, trying next fallback...`);
        continue;
      }

      const data = await res.json();
      const textPart = data.candidates?.[0]?.content?.parts?.find((p: { text?: string }) => p.text);

      if (!textPart?.text) {
        console.warn(`Gemini model ${model} returned empty text, trying next fallback...`);
        continue;
      }

      let cleanedJson = textPart.text.trim();
      if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }
      const firstBrace = cleanedJson.indexOf('{');
      const lastBrace = cleanedJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedJson = cleanedJson.slice(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleanedJson);

      // Validate core fields exist
      if (!parsed.summaryDiagnosis || !parsed.actionSteps || !parsed.weatherSynthesis) {
        console.warn(`Gemini response missing critical keys, trying next fallback...`);
        continue;
      }

      // 1. Calculate dynamic multi-factor health score if model defaulted to 82/74
      const calculatedHealth = calculateDynamicHealthScore(
        payload,
        hasSoilMetrics,
        weather,
        parsed.identifiedProblem?.severity || 'moderate'
      );
      const overallHealthScore =
        typeof parsed.overallHealthScore === 'number' &&
        parsed.overallHealthScore !== 82 &&
        parsed.overallHealthScore !== 74
          ? parsed.overallHealthScore
          : calculatedHealth;

      // 2. Strict enforcement of dosage guardrails in code: sanitize any numeric rates if soil lab data is missing
      let guardedPrescriptions = Array.isArray(parsed.fertilizerAdvisory?.prescriptions)
        ? parsed.fertilizerAdvisory.prescriptions
        : [];

      if (!hasSoilMetrics && guardedPrescriptions.length > 0) {
        guardedPrescriptions = guardedPrescriptions.map((rx: any) => {
          const rateText = String(rx.estimatedRate || '');
          const hasNumericRate = /\d+\s*(?:-|–|\/|\b)\s*\d*\s*(?:k[gq]\/ha|l\/ha|litr\/ha|ppm|%)/i.test(rateText);
          return {
            ...rx,
            estimatedRate: hasNumericRate
              ? (isAz
                  ? 'Laboratoriya təsdiqi tələb olunur (Dəqiq norma dayandırılıb)'
                  : 'Lab verification required (Quantitative rate held)')
              : (rx.estimatedRate || (isAz ? 'Ehtiyatlı ilkin norma' : 'Conservative baseline only')),
            isGuardedEstimate: true,
          };
        });
      }

      // Add AgroSphere partner links and standard metadata
      const report: AgronomicAdvisoryReport = {
        id: `agro-gemini-${Date.now()}`,
        source: 'gemini',
        createdAt: new Date().toISOString(),
        farmProfile: payload as FarmSubmissionPayload,
        overallHealthScore,
        summaryDiagnosis: parsed.summaryDiagnosis,
        mainFindings: Array.isArray(parsed.mainFindings) ? parsed.mainFindings : [],
        identifiedProblem: parsed.identifiedProblem,
        cropSpecificGuidance: parsed.cropSpecificGuidance || {
          optimalTemperature: '22-30°C',
          stageManagement: isAz ? 'Aqrotexniki qulluq davam etdirilir.' : 'Standard crop management applies.',
          canopyCare: isAz ? 'Çətir nəzarətdə saxlanılır.' : 'Canopy monitoring required.',
          keyRisks: [],
        },
        soilFertility: parsed.soilFertility || {
          soilType: payload.soilType || 'Loamy',
          metrics: [],
          fertilityIndex: 'Moderate',
          notes: isAz ? 'Torpaq analizi qeydləri.' : 'Soil analysis notes.',
        },
        fertilizerAdvisory: {
          safeDosageNotice: parsed.fertilizerAdvisory?.safeDosageNotice || (isAz ? 'Dozalanmanı yerli torpaq tipinə uyğunlaşdırın.' : 'Calibrate dosage to local soil texture.'),
          prescriptions: guardedPrescriptions,
          agroSphereLink: {
            title: isAz ? 'Uyğun Gübrələri AgroSphere-də İncələyin' : 'Explore Fertilizers on AgroSphere',
            description: isAz
              ? 'Tövsiyə olunan mikro və makro gübrələri AgroSphere tərəfdaşlarından sifariş edin.'
              : 'Procure recommended macro and micro nutrients through verified suppliers on AgroSphere.',
            destinationUrl: 'https://www.aqrosphere.com/',
            serviceType: 'fertilizer',
            callToActionText: isAz ? 'Gübrə Təchizatçılarına Baxın' : 'View Fertilizer Suppliers',
          },
        },
        irrigationAdvisory: {
          currentMethod: parsed.irrigationAdvisory?.currentMethod || payload.irrigationMethod || 'Drip Irrigation',
          recommendedFrequency: parsed.irrigationAdvisory?.recommendedFrequency || (isAz ? 'Hər 4-5 gündən bir' : 'Every 4-5 days'),
          waterRequirementMmPerWeek: typeof parsed.irrigationAdvisory?.waterRequirementMmPerWeek === 'number'
            ? parsed.irrigationAdvisory.waterRequirementMmPerWeek
            : 28,
          managementTips: Array.isArray(parsed.irrigationAdvisory?.managementTips) ? parsed.irrigationAdvisory.managementTips : [],
        },
        plantProtection: {
          diagnosedStressors: Array.isArray(parsed.plantProtection?.diagnosedStressors) ? parsed.plantProtection.diagnosedStressors : [],
          preventativeControls: Array.isArray(parsed.plantProtection?.preventativeControls) ? parsed.plantProtection.preventativeControls : [],
          organicInterventions: Array.isArray(parsed.plantProtection?.organicInterventions) ? parsed.plantProtection.organicInterventions : [],
          specificTreatments: Array.isArray(parsed.plantProtection?.specificTreatments) ? parsed.plantProtection.specificTreatments : undefined,
          agroSphereLink: {
            title: isAz ? 'AgroSphere-də Bitki Mühafizə Vasitələri ilə Tanış Olun' : 'Explore Plant Protection Products on AgroSphere',
            description: isAz
              ? 'Lisenziyalı bioloji preparatlar və inteqrasiya olunmuş zərərverici mühafizə vasitələrini AgroSphere təchizatçılarından əldə edin.'
              : 'Review licensed organic bio-fungicides and integrated pest management supplies available through verified suppliers on AgroSphere.',
            destinationUrl: 'https://www.aqrosphere.com/',
            serviceType: 'protection',
            callToActionText: isAz ? 'Bitki Mühafizə Məhsullarına Baxın' : 'Explore Crop Protection on AgroSphere',
          },
        },
        actionSteps: Array.isArray(parsed.actionSteps) ? parsed.actionSteps : [],
        uncertaintiesAndGaps: Array.isArray(parsed.uncertaintiesAndGaps) ? parsed.uncertaintiesAndGaps : [],
        scientificCitations: (() => {
          let citations = Array.isArray(parsed.scientificCitations) && parsed.scientificCitations.length > 0
            ? parsed.scientificCitations.filter(
                (c: { title?: string; source?: string }) => c && typeof c.title === 'string' && c.title.trim().length > 0
              )
            : [];

          if (citations.length === 0 && ragReferences.length > 0) {
            citations = ragReferences.map(ref => ({
              title: ref.chunk.title,
              source: ref.chunk.author,
              year: ref.chunk.year,
              relevance: ref.chunk.content.length > 160
                ? `${ref.chunk.content.slice(0, 157)}...`
                : ref.chunk.content,
            }));
          }

          return citations;
        })(),
        weatherData: weather,
        weatherSynthesis: parsed.weatherSynthesis,
      };

      return { report, source: 'gemini' };
    } catch (err) {
      console.warn(`Error querying Gemini model ${model}:`, err);
    }
  }

  // If all Gemini attempts failed or timed out, gracefully return rules engine report
  console.warn('All Gemini models exhausted. Serving resilient regional rules-engine advisory.');
  const fallback = generateMockAdvisoryReport(payload, lang, weather);
  fallback.source = 'rules-engine';
  return {
    report: fallback,
    source: 'rules-engine',
  };
}
