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
    // Dosage guardrail: every prescription must be marked guarded when soil metrics are omitted
    expect(report.fertilizerAdvisory.prescriptions.every(p => p.isGuardedEstimate)).toBe(true);
  });

  it('agronomically discriminates vegetative cotton from late boll maturation (prohibits premature defoliation)', () => {
    // Adversarial scenario: vegetative cotton with query containing "cotton"
    const vegReport = generateMockAdvisoryReport({
      region: 'Aran',
      crop: 'Cotton',
      growthStage: 'Vegetative Branching',
      mainProblem: 'General health checkup for cotton crop canopy'
    });

    // Must NOT trigger aggressive boll opening defoliants or terminate irrigation during vegetative growth
    expect(vegReport.identifiedProblem?.problemTitle).not.toContain('Delayed Cotton Boll');
    expect(vegReport.irrigationAdvisory.waterRequirementMmPerWeek).toBeGreaterThan(0);
    expect(vegReport.plantProtection.specificTreatments?.[0]?.medicineName).not.toContain('Defoliant');

    // Late maturation stage with explicit boll opening delay
    const matureReport = generateMockAdvisoryReport({
      region: 'Aran',
      crop: 'Cotton',
      growthStage: 'Boll Opening & Defoliation',
      mainProblem: 'Pambıq qozaları gec açılır və sahədə yaşıl kütlə çoxdur'
    }, 'az');

    expect(matureReport.identifiedProblem?.problemTitle).toContain('Qozaların Açılması');
    expect(matureReport.irrigationAdvisory.waterRequirementMmPerWeek).toBe(0);
  });
});
