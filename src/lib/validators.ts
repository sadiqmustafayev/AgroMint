import { z } from 'zod';

export const soilMetricsSchema = z.object({
  ph: z.number().min(3.0).max(11.0).optional().nullable(),
  organicMatterPct: z.number().min(0).max(25.0).optional().nullable(),
  nitrogenPpm: z.number().min(0).max(1000).optional().nullable(),
  phosphorusPpm: z.number().min(0).max(500).optional().nullable(),
  potassiumPpm: z.number().min(0).max(2000).optional().nullable(),
  salinityEc: z.number().min(0).max(20.0).optional().nullable(),
}).optional();

export const farmFormSchema = z.object({
  region: z.string().min(1, 'Region is required'),
  district: z.string().optional().default(''),
  farmAreaHectares: z.number().positive().optional().nullable(),
  crop: z.string().min(1, 'Crop type is required'),
  growthStage: z.string().optional().default(''),
  previousCrop: z.string().optional().default(''),
  soilType: z.string().optional().default('Unknown / Unsure'),
  soilMode: z.enum(['upload', 'manual']).optional().default('upload'),
  soilMetrics: soilMetricsSchema,
  uploadedDocumentNames: z.array(z.string()).optional().default([]),
  irrigationMethod: z.string().optional().default('Not Specified'),
  waterSource: z.string().optional().default('Not Specified'),
  mainProblem: z.string().min(1, 'Please describe your main agricultural problem or question'),
  uploadedPhotoNames: z.array(z.string()).optional().default([]),
});

export type FarmFormValues = z.infer<typeof farmFormSchema>;
