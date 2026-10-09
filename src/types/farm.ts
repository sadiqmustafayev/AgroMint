export interface SoilMetrics {
  ph?: number;
  organicMatterPct?: number;
  nitrogenPpm?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  salinityEc?: number;
}

export type SoilType =
  | 'Sandy'
  | 'Loamy'
  | 'Clay'
  | 'Silt'
  | 'Peaty'
  | 'Chalky'
  | 'Unknown / Unsure';

export type IrrigationMethod =
  | 'Drip Irrigation'
  | 'Sprinkler System'
  | 'Flood / Furrow'
  | 'Rain-fed Only'
  | 'Not Specified';

export type WaterSource =
  | 'Deep Borewell / Groundwater'
  | 'Irrigation Canal'
  | 'River / Stream'
  | 'Rainwater Reservoir'
  | 'Municipal Supply'
  | 'Not Specified';

export interface FarmSubmissionPayload {
  region: string;
  district?: string;
  farmAreaHectares?: number;
  crop: string;
  growthStage?: string;
  previousCrop?: string;
  soilType?: SoilType;
  soilMode?: 'upload' | 'manual';
  soilMetrics?: SoilMetrics;
  uploadedDocumentNames?: string[];
  irrigationMethod?: IrrigationMethod;
  waterSource?: WaterSource;
  mainProblem: string;
  uploadedPhotoNames?: string[];
}
