import { describe, it, expect } from 'vitest';
import { getCropGrowthStages, AVAILABLE_CROPS } from '../src/lib/cropStages';
import { farmFormSchema } from '../src/lib/validators';

describe('Crop Stages and Form Validation', () => {
  it('contains expected list of agricultural crops', () => {
    expect(AVAILABLE_CROPS).toBeDefined();
    expect(AVAILABLE_CROPS.length).toBeGreaterThan(5);
    expect(AVAILABLE_CROPS).toContain('Wheat');
    expect(AVAILABLE_CROPS).toContain('Cotton');
    expect(AVAILABLE_CROPS).toContain('Tomato');
  });

  it('returns valid growth stages for wheat', () => {
    const stages = getCropGrowthStages('Wheat');
    expect(stages).toContain('Vegetative / Tillering');
    expect(stages).toContain('Grain Filling / Maturation');
  });

  it('returns fallback generic stages for unknown crop', () => {
    const stages = getCropGrowthStages('Unknown Crop');
    expect(stages).toContain('Vegetative');
    expect(stages).toContain('Maturity / Harvest');
  });

  it('validates a minimal submission allowing optional fields to be omitted', () => {
    const result = farmFormSchema.safeParse({
      region: 'Central Valley',
      crop: 'Wheat',
      mainProblem: 'Yellowing leaves on lower canopy'
    });
    expect(result.success).toBe(true);
  });

  it('validates a complete submission with soil metrics', () => {
    const result = farmFormSchema.safeParse({
      region: 'Ganja-Dashkasan',
      district: 'Samukh',
      farmAreaHectares: 15,
      crop: 'Cotton',
      growthStage: 'Squaring / Flowering',
      soilType: 'Loamy',
      soilMode: 'manual',
      soilMetrics: {
        ph: 7.2,
        organicMatterPct: 2.1,
        nitrogenPpm: 35,
        phosphorusPpm: 20,
        potassiumPpm: 240,
        salinityEc: 1.1,
      },
      irrigationMethod: 'Drip',
      waterSource: 'Borewell',
      mainProblem: 'Optimizing nitrogen top-dressing timing'
    });
    expect(result.success).toBe(true);
  });
});
