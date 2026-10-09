import { FarmSubmissionPayload } from '../types/farm';
import { AgronomicAdvisoryReport } from '../types/advisory';
import { SevenDayWeatherData } from './weatherService';
import { generateMockAdvisoryReport } from './mockAdvisory';

const GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-flash-latest'];

export async function generateGeminiAdvisoryReport(
  payload: Partial<FarmSubmissionPayload>,
  weather: SevenDayWeatherData,
  lang: 'en' | 'az' = 'en'
): Promise<{ report: AgronomicAdvisoryReport; source: 'gemini' | 'rules-engine' }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. Falling back to rules engine.');
    return {
      report: generateMockAdvisoryReport(payload, lang, weather),
      source: 'rules-engine',
    };
  }

  const isAz = lang === 'az';

  const prompt = `You are AgroMint AI, an expert precision agronomy intelligence system.
Analyze the provided farm profile alongside the live 7-day meteorological forecast to generate a personalized agronomic advisory report.

CRITICAL INSTRUCTION:
You MUST integrate the 7-day weather forecast directly into your agricultural conclusions:
1. Irrigation: Adjust weekly water requirement (mm) based on total expected rainfall (${weather.summary.totalRainfallMm} mm). Advise on pump shutoff or frequency adjustments during rain days.
2. Fertilization: MUST provide SPECIFIC fertilizer product/chemical names (e.g. "Karbamid (Urea 46% N)", "Ammofos (12-52 MAP)", "Kalium Sulfat", "Diammofoska (10-26-26)", "Kalsium Nitrat", "NPK 15-15-15"). Warn against applying granular surface nitrogen immediately before high-probability rain days to prevent nitrate leaching.
3. Plant Protection & Specific Medications: MUST diagnose the primary problem (especially taking into account the user's reported problem in mainProblem such as weeds, insect pests, fungus, or chlorosis). For weeds (alaq otu), specify exact herbicide names (e.g., "Herbisid: Qlifosat 480 q/l (cərgəarası)", "Selektiv herbisid: Pendimetalin 330 EC", "2,4-D amin duzu") and provide clear step-by-step instructions on how to eradicate them! For insect pests: specify exact insecticides (e.g. "İnsektisid: İmidakloprid 200 q/l", "Asetamiprid 20 SP"). For diseases: specify exact fungicides (e.g. "Funqisid: Azoksistrobin + Difenokonazol", "Mis kuporosu / Bordos mayesi 1%").
4. Weather Synthesis: Provide clear agronomic synthesis (headline, summary, irrigationImpact, fertilizerImpact, protectionImpact, sprayWindowRecommendation).
5. Action Steps: Action 1 must be immediate (1-2 days) accounting for immediate weather and urgent problem intervention. Action 2 must be near-term (3-7 days). Action 3 for next growth phase.

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
        "estimatedRate": "150-180 kq/ha",
        "isGuardedEstimate": true
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
      "title": "...",
      "source": "...",
      "year": 2023,
      "relevance": "..."
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
      const timeoutId = setTimeout(() => controller.abort(), 9000);

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

      const rawJson = textPart.text.trim();
      const parsed = JSON.parse(rawJson);

      // Validate core fields exist
      if (!parsed.summaryDiagnosis || !parsed.actionSteps || !parsed.weatherSynthesis) {
        console.warn(`Gemini response missing critical keys, trying next fallback...`);
        continue;
      }

      // Add AgroSphere partner links and standard metadata
      const report: AgronomicAdvisoryReport = {
        id: `agro-gemini-${Date.now()}`,
        createdAt: new Date().toISOString(),
        farmProfile: payload as FarmSubmissionPayload,
        overallHealthScore: typeof parsed.overallHealthScore === 'number' ? parsed.overallHealthScore : 82,
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
          prescriptions: Array.isArray(parsed.fertilizerAdvisory?.prescriptions) ? parsed.fertilizerAdvisory.prescriptions : [],
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
        scientificCitations: Array.isArray(parsed.scientificCitations) ? parsed.scientificCitations : [],
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
  return {
    report: generateMockAdvisoryReport(payload, lang, weather),
    source: 'rules-engine',
  };
}
