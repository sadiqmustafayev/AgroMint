import { FarmSubmissionPayload } from '../types/farm';
import { AgronomicAdvisoryReport, MetricEvaluation } from '../types/advisory';

export function generateMockAdvisoryReport(
  payload: Partial<FarmSubmissionPayload>
): AgronomicAdvisoryReport {
  const crop = payload.crop || 'Wheat';
  const stage = payload.growthStage || 'Vegetative';
  const region = payload.region || 'Regional District';
  const hasSoilMetrics = Boolean(
    payload.soilMetrics &&
      (payload.soilMetrics.ph !== undefined ||
        payload.soilMetrics.nitrogenPpm !== undefined)
  );

  const metrics: MetricEvaluation[] = hasSoilMetrics
    ? [
        {
          parameter: 'Soil pH',
          value: payload.soilMetrics?.ph ?? 6.8,
          unit: 'pH',
          status:
            (payload.soilMetrics?.ph ?? 6.8) >= 6.2 &&
            (payload.soilMetrics?.ph ?? 6.8) <= 7.5
              ? 'optimal'
              : 'high',
          benchmark: '6.0 - 7.2 (Ideal bioavailability)',
          interpretation:
            'Neutral to slightly alkaline; micronutrient availability is favorable.',
        },
        {
          parameter: 'Available Nitrogen (N)',
          value: payload.soilMetrics?.nitrogenPpm ?? 28,
          unit: 'ppm',
          status: (payload.soilMetrics?.nitrogenPpm ?? 28) < 30 ? 'low' : 'optimal',
          benchmark: '35 - 50 ppm',
          interpretation:
            'Nitrogen reserves are below peak vegetative requirement.',
        },
        {
          parameter: 'Available Phosphorus (P)',
          value: payload.soilMetrics?.phosphorusPpm ?? 19,
          unit: 'ppm',
          status: 'optimal',
          benchmark: '15 - 25 ppm (Olsen)',
          interpretation:
            'Sufficient for root development and early reproductive structures.',
        },
        {
          parameter: 'Potassium (K)',
          value: payload.soilMetrics?.potassiumPpm ?? 190,
          unit: 'ppm',
          status: 'optimal',
          benchmark: '150 - 250 ppm',
          interpretation:
            'Good osmotic regulation and stalk strength capability.',
        },
      ]
    : [
        {
          parameter: 'Soil pH (Estimated)',
          value: '7.1 (Regional Est.)',
          unit: 'pH',
          status: 'unknown',
          benchmark: '6.0 - 7.2',
          interpretation:
            'Estimated based on regional geological baseline. Laboratory verification strongly advised.',
        },
        {
          parameter: 'Nitrogen (N) Baseline',
          value: 'Unmeasured',
          unit: 'ppm',
          status: 'unknown',
          benchmark: '35 - 50 ppm',
          interpretation:
            'Lab analysis required to prevent over-fertilization and nitrate leaching.',
        },
        {
          parameter: 'Phosphorus (P) Baseline',
          value: 'Unmeasured',
          unit: 'ppm',
          status: 'unknown',
          benchmark: '15 - 25 ppm',
          interpretation:
            'Phosphorus status unverified; apply starter doses conservatively.',
        },
        {
          parameter: 'Potassium (K) Baseline',
          value: 'Unmeasured',
          unit: 'ppm',
          status: 'unknown',
          benchmark: '150 - 250 ppm',
          interpretation: 'Unmeasured in farmer questionnaire.',
        },
      ];

  const safeDosageNotice = hasSoilMetrics
    ? 'Dosage calculation calibrated to submitted soil laboratory parameters.'
    : 'Caution: Precise chemical application rates cannot be guaranteed without calibrated soil laboratory analysis. Dosages shown are conservative regional estimates.';

  const uncertaintiesAndGaps: string[] = [];
  if (!hasSoilMetrics) {
    uncertaintiesAndGaps.push(
      'Exact laboratory soil nutrient data (N-P-K, micronutrients, cation exchange capacity) was not provided.'
    );
  }
  if (!payload.farmAreaHectares) {
    uncertaintiesAndGaps.push(
      'Total field area in hectares not specified; aggregate bulk order volumes cannot be calculated.'
    );
  }
  if (!payload.irrigationMethod || payload.irrigationMethod === 'Not Specified') {
    uncertaintiesAndGaps.push(
      'Irrigation method and water source unconfirmed; scheduling assumes standard regional precipitation balance.'
    );
  }

  return {
    id: `AGM-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    farmProfile: {
      region,
      district: payload.district || 'Unspecified District',
      farmAreaHectares: payload.farmAreaHectares ?? undefined,
      crop,
      growthStage: stage,
      previousCrop: payload.previousCrop || 'Not Specified',
      soilType: payload.soilType || 'Unknown / Unsure',
      soilMode: payload.soilMode || (hasSoilMetrics ? 'manual' : 'upload'),
      soilMetrics: payload.soilMetrics,
      irrigationMethod: payload.irrigationMethod || 'Not Specified',
      waterSource: payload.waterSource || 'Not Specified',
      mainProblem:
        payload.mainProblem || 'General agronomic health evaluation and fertility plan.',
      uploadedDocumentNames: payload.uploadedDocumentNames || [],
      uploadedPhotoNames: payload.uploadedPhotoNames || [],
    },
    overallHealthScore: hasSoilMetrics ? 82 : 74,
    summaryDiagnosis: `Field evaluation for ${crop} during the ${stage} window in ${region}. Nutrient bioavailability is manageable with targeted nitrogen supplementation and balanced moisture intervals.`,
    mainFindings: [
      `Crop is currently in ${stage}, a sensitive vegetative-to-reproductive phase requiring sustained nutrient bioavailability.`,
      hasSoilMetrics
        ? 'Soil pH indicates neutral conditions; nitrogen levels require replenishment before peak flowering/tillering.'
        : 'Lack of lab soil testing necessitates split applications to prevent nutrient toxicity or leaching.',
      `Primary reported concern regarding "${payload.mainProblem || 'crop performance'}" is addressed through phased cultural and nutritional controls.`,
    ],
    cropSpecificGuidance: {
      optimalTemperature: '18°C – 28°C Day / 14°C – 18°C Night',
      stageManagement: `Focus on uninterrupted cellular expansion and leaf area index during ${stage}. Avoid moisture stress during thermal peaks.`,
      canopyCare:
        'Maintain row aeration to reduce fungal spore germination in lower leaf layers.',
      keyRisks: [
        'Transpiration stress during midday high temperatures',
        'Foliar fungal pathogens under prolonged leaf wetness',
      ],
    },
    soilFertility: {
      soilType: payload.soilType || 'Loamy / Unverified',
      metrics,
      fertilityIndex: hasSoilMetrics ? 'Balanced' : 'Unknown',
      notes: hasSoilMetrics
        ? 'Soil parameters support effective cation uptake with moderate buffering capacity.'
        : 'Unverified baseline. Recommended to perform standard Mehlich-3 soil extract test.',
    },
    fertilizerAdvisory: {
      safeDosageNotice,
      prescriptions: [
        {
          nutrient: 'Nitrogen (N)',
          fertilizerType: 'Urea (46-0-0) or Calcium Ammonium Nitrate (CAN)',
          timing: 'Early morning split top-dress',
          estimatedRate: hasSoilMetrics ? '60 - 80 kg/ha' : 'Conservative baseline only',
          isGuardedEstimate: !hasSoilMetrics,
        },
        {
          nutrient: 'Phosphorus (P2O5)',
          fertilizerType: 'Diammonium Phosphate (DAP 18-46-0)',
          timing: 'Localized band placement if required',
          estimatedRate: hasSoilMetrics ? '30 - 45 kg/ha' : 'Lab verification needed',
          isGuardedEstimate: !hasSoilMetrics,
        },
        {
          nutrient: 'Potassium (K2O)',
          fertilizerType: 'Potassium Sulfate (SOP 0-0-50)',
          timing: 'Mid-stage fertigation or soil incorporation',
          estimatedRate: hasSoilMetrics ? '40 - 50 kg/ha' : 'Standard regional buffer',
          isGuardedEstimate: !hasSoilMetrics,
        },
      ],
      agroSphereLink: {
        title: 'Explore and Order Certified Fertilizers on AgroSphere',
        description:
          'Connect directly with certified agricultural input distributors on the AgroSphere marketplace for laboratory-tested fertilizers and custom mineral blends.',
        destinationUrl: 'https://agrosphere.org/marketplace/fertilizers',
        serviceType: 'fertilizer',
        callToActionText: 'View Suitable Fertilizers on AgroSphere',
      },
    },
    irrigationAdvisory: {
      currentMethod: payload.irrigationMethod || 'Standard Irrigation',
      recommendedFrequency: 'Every 4-6 days (adapted to evapotranspiration rates)',
      waterRequirementMmPerWeek: 32,
      managementTips: [
        'Irrigate during early dawn hours to maximize root absorption and reduce surface evaporative loss.',
        'Monitor tensiometer or soil feel at 25-30cm root depth before commencing pumping cycle.',
        'Ensure drainage channels prevent standing water in root zones.',
      ],
    },
    plantProtection: {
      diagnosedStressors: [
        'Aphid / sucking pest pressure in lush new foliage',
        'Early fungal leaf blight susceptibility due to canopy density',
      ],
      preventativeControls: [
        'Deploy yellow sticky monitoring cards (15-20 units/ha) for early threshold detection.',
        'Maintain balanced nitrogen to prevent excessively soft succulent tissue susceptible to pests.',
      ],
      organicInterventions: [
        'Neem seed kernel extract (NSKE 5%) or mineral oil foliar spray at initial spotting.',
        'Beneficial entomopathogenic fungi (Beauveria bassiana) during humid evenings.',
      ],
      agroSphereLink: {
        title: 'Explore Plant Protection Products on AgroSphere',
        description:
          'Review licensed organic bio-fungicides and integrated pest management supplies available through verified suppliers on AgroSphere.',
        destinationUrl: 'https://agrosphere.org/marketplace/plant-protection',
        serviceType: 'protection',
        callToActionText: 'Explore Crop Protection on AgroSphere',
      },
    },
    actionSteps: [
      {
        id: 'act-1',
        title: 'Calibrate Irrigation & Inspect Moisture Zone',
        timeline: 'Immediate (1-2 Days)',
        description:
          'Verify soil moisture at 20cm depth. Adjust schedule to prevent water stress during current growth window.',
        importance: 'critical',
      },
      {
        id: 'act-2',
        title: 'Execute Split Nitrogen Top-Dressing',
        timeline: 'Near-term (3-7 Days)',
        description:
          'Apply nitrogen in split applications, ideally right before scheduled irrigation or rain event.',
        importance: 'standard',
      },
      {
        id: 'act-3',
        title: 'Canopy Monitoring & Disease Scouting',
        timeline: 'Near-term (3-7 Days)',
        description:
          'Walk field in "W" pattern; check underside of lower leaves for fungal lesions or vector populations.',
        importance: 'preventative',
      },
      {
        id: 'act-4',
        title: 'Comprehensive Soil Lab Sampling',
        timeline: 'Next Growth Phase',
        description:
          'Collect core soil samples across representative zones to unlock precise micro-dosing for subsequent season.',
        importance: 'standard',
      },
    ],
    uncertaintiesAndGaps,
    scientificCitations: [
      {
        title: 'FAO Irrigation and Drainage Paper No. 56: Crop Evapotranspiration',
        source: 'Food and Agriculture Organization (FAO), Rome',
        year: 2021,
        relevance: 'Guidelines for computing crop water requirements in arid/semi-arid regions.',
      },
      {
        title: 'Nutrient Management Guidelines for Field Crops',
        source: 'International Plant Nutrition Institute (IPNI)',
        year: 2022,
        relevance: 'Nitrogen and potassium uptake kinetics by phenological growth stage.',
      },
      {
        title: 'Integrated Pest Management: Field Guide for Cereal and Horticultural Crops',
        source: 'Global Agronomy Extension Series',
        year: 2023,
        relevance: 'Economic injury thresholds and non-chemical cultural pest control strategies.',
      },
    ],
  };
}
