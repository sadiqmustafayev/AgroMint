import { FarmSubmissionPayload, SoilMetrics } from './farm';

export interface AgroSphereOutboundLink {
  title: string;
  description: string;
  destinationUrl: string;
  serviceType: 'fertilizer' | 'protection' | 'agronomist' | 'equipment';
  callToActionText: string;
}

export interface MetricEvaluation {
  parameter: string;
  value: number | string;
  unit: string;
  status: 'low' | 'optimal' | 'high' | 'unknown';
  benchmark: string;
  interpretation: string;
}

export interface RecommendationAction {
  id: string;
  title: string;
  timeline: 'Immediate (1-2 Days)' | 'Near-term (3-7 Days)' | 'Next Growth Phase';
  description: string;
  importance: 'critical' | 'standard' | 'preventative';
}

export interface AgronomicAdvisoryReport {
  id: string;
  createdAt: string;
  farmProfile: FarmSubmissionPayload;
  overallHealthScore: number; // 0-100
  summaryDiagnosis: string;
  mainFindings: string[];
  cropSpecificGuidance: {
    optimalTemperature: string;
    stageManagement: string;
    canopyCare: string;
    keyRisks: string[];
  };
  soilFertility: {
    soilType: string;
    metrics: MetricEvaluation[];
    fertilityIndex: 'Low' | 'Moderate' | 'Balanced' | 'Alkaline Stress' | 'Unknown';
    notes: string;
  };
  fertilizerAdvisory: {
    safeDosageNotice: string;
    prescriptions: {
      nutrient: string;
      fertilizerType: string;
      timing: string;
      estimatedRate: string;
      isGuardedEstimate: boolean;
    }[];
    agroSphereLink?: AgroSphereOutboundLink;
  };
  irrigationAdvisory: {
    currentMethod: string;
    recommendedFrequency: string;
    waterRequirementMmPerWeek: number;
    managementTips: string[];
  };
  plantProtection: {
    diagnosedStressors: string[];
    preventativeControls: string[];
    organicInterventions: string[];
    agroSphereLink?: AgroSphereOutboundLink;
  };
  actionSteps: RecommendationAction[];
  uncertaintiesAndGaps: string[];
  scientificCitations: {
    title: string;
    source: string;
    year: number;
    relevance: string;
  }[];
}
