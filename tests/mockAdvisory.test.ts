import { describe, it, expect } from 'vitest';
import { generateMockAdvisoryReport } from '../src/lib/mockAdvisory';

describe('generateMockAdvisoryReport', () => {
  it('generates an advisory report with all 10 card sections and AgroSphere references', () => {
    const report = generateMockAdvisoryReport({
      region: 'Ganja-Dashkasan',
      crop: 'Cotton',
      growthStage: 'Squaring / Flowering',
      farmAreaHectares: 25,
      mainProblem: 'Leaves showing interveinal chlorosis'
    });

    expect(report.id).toBeDefined();
    expect(report.farmProfile.crop).toBe('Cotton');
    expect(report.mainFindings.length).toBeGreaterThan(0);
    expect(report.overallHealthScore).toBeGreaterThanOrEqual(0);
    expect(report.overallHealthScore).toBeLessThanOrEqual(100);

    // Crop guidance
    expect(report.cropSpecificGuidance.optimalTemperature).toBeDefined();
    expect(report.cropSpecificGuidance.keyRisks.length).toBeGreaterThan(0);

    // Soil & Fertilizer
    expect(report.soilFertility.metrics.length).toBeGreaterThanOrEqual(4);
    expect(report.fertilizerAdvisory.prescriptions.length).toBeGreaterThan(0);
    expect(report.fertilizerAdvisory.agroSphereLink).toBeDefined();
    expect(report.fertilizerAdvisory.agroSphereLink?.title).toContain('AgroSphere');
    expect(report.fertilizerAdvisory.agroSphereLink?.destinationUrl).toMatch(/^https:\/\//);

    // Irrigation & Protection
    expect(report.irrigationAdvisory.recommendedFrequency).toBeDefined();
    expect(report.plantProtection.agroSphereLink).toBeDefined();
    expect(report.plantProtection.agroSphereLink?.title).toContain('AgroSphere');

    // Action Steps & Uncertainties
    expect(report.actionSteps.length).toBeGreaterThanOrEqual(3);
    expect(report.uncertaintiesAndGaps.length).toBeGreaterThan(0);
    expect(report.scientificCitations.length).toBeGreaterThan(0);
  });

  it('adds explicit uncertainty warnings when soil analysis is omitted', () => {
    const report = generateMockAdvisoryReport({
      region: 'Central Valley',
      crop: 'Wheat',
      mainProblem: 'Need general spring advisory'
    });

    expect(report.fertilizerAdvisory.safeDosageNotice).toContain('Caution');
    expect(report.uncertaintiesAndGaps.some(g => g.toLowerCase().includes('soil'))).toBe(true);
  });
});
