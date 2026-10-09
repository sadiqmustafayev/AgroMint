import { describe, it, expect } from 'vitest';
import { generateMockAdvisoryReport, calculateDynamicHealthScore } from '../src/lib/mockAdvisory';
import { getFallback7DayWeather, SevenDayWeatherData } from '../src/lib/weatherService';
import { retrieveAgronomicContext } from '../src/lib/ragService';

describe('AgroMint Precision Agronomic Evaluation Benchmark Suite', () => {
  const standardWeather = getFallback7DayWeather({ lat: 40.6, lon: 47.1, name: 'Aran' }, 'az');

  // Helper for mock heavy rain weather
  const heavyRainWeather: SevenDayWeatherData = {
    ...standardWeather,
    summary: {
      ...standardWeather.summary,
      totalRainfallMm: 34.5,
      hasHeavyRainRisk: true,
      rainyDaysCount: 4,
    },
  };

  // Helper for mock high wind weather
  const highWindWeather: SevenDayWeatherData = {
    ...standardWeather,
    summary: {
      ...standardWeather.summary,
      maxWindSpeedKmH: 26.5,
    },
  };

  // Helper for mock heatwave weather
  const heatwaveWeather: SevenDayWeatherData = {
    ...standardWeather,
    summary: {
      ...standardWeather.summary,
      avgMaxTemp: 34.8,
      hasHeatwaveRisk: true,
    },
  };

  it('Case 1: Cotton in squaring phase with severe weed infestation (Alaq otu)', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Cotton',
        growthStage: 'Squaring / Flowering',
        region: 'Aran',
        district: 'Yevlax',
        mainProblem: 'Sahədə intensiv alaq otu basması var, qanqal və yabanı otlar bitkini sıxışdırır',
      },
      'az',
      standardWeather
    );

    expect(report.identifiedProblem?.problemTitle).toContain('Alaq Otu Basması');
    expect(report.identifiedProblem?.solutionPlan).toContain('Qlifosat');
    // Must NOT prescribe defoliants or terminate irrigation during vegetative/squaring growth
    expect(report.identifiedProblem?.solutionPlan).not.toContain('Etefon');
    expect(report.irrigationAdvisory.waterRequirementMmPerWeek).toBeGreaterThan(0);
    expect(report.plantProtection.specificTreatments?.[0]?.medicineName).toContain('Herbisid');
  });

  it('Case 2: Cotton in late boll maturation with delayed boll opening (Qoza açılmaması)', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Cotton',
        growthStage: 'Boll Opening & Defoliation',
        region: 'Aran',
        mainProblem: 'Pambıq qozaları gec açılır və sahədə yaşıl kütlə çoxdur, defoliasiya lazımdır',
      },
      'az',
      standardWeather
    );

    expect(report.identifiedProblem?.problemTitle).toContain('Qozaların Açılması');
    expect(report.identifiedProblem?.solutionPlan).toContain('Etefon 480 q/l');
    // Maturation requires terminating irrigation to induce dry-down
    expect(report.irrigationAdvisory.waterRequirementMmPerWeek).toBe(0);
    // Nitrogen must be strictly suspended
    const nRx = report.fertilizerAdvisory.prescriptions.find((p) => p.nutrient.includes('Azot'));
    expect(nRx?.estimatedRate).toBe('0 kq/ha');
  });

  it('Case 3: Cotton in vegetative branching with general health query (Bugfix Verification)', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Cotton',
        growthStage: 'Vegetative Branching',
        region: 'Aran',
        mainProblem: 'Routine field scouting for cotton parcel #4',
      },
      'en',
      standardWeather
    );

    // Must NOT trigger aggressive boll opening or irrigation cutoff
    expect(report.identifiedProblem?.problemTitle).not.toContain('Delayed Cotton Boll');
    expect(report.irrigationAdvisory.waterRequirementMmPerWeek).toBeGreaterThan(0);
    expect(report.irrigationAdvisory.recommendedFrequency).not.toContain('terminate');
  });

  it('Case 4: Winter wheat with basal nitrogen chlorosis (Sarı yarpaqlar / xloroz)', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        growthStage: 'Vegetative / Tillering',
        region: 'Aran',
        mainProblem: 'Aşağı yarpaqlarda saralma və xloroz müşahidə olunur, azot çatışmazlığı şübhəsi var',
      },
      'az',
      standardWeather
    );

    expect(report.identifiedProblem?.problemTitle).toContain('Azot Çatışmazlığı');
    expect(report.identifiedProblem?.solutionPlan).toContain('Karbamid');
    expect(report.fertilizerAdvisory.prescriptions.some((p) => p.nutrient.includes('Azot'))).toBe(true);
  });

  it('Case 5: Winter wheat with foliar pest pressure / sucking insects', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        growthStage: 'Stem Elongation / Jointing',
        region: 'Ganja-Dashkasan',
        mainProblem: 'Sahədə zərərverici həşəratlar və mənənə populyasiyası artıb',
      },
      'az',
      standardWeather
    );

    expect(report.identifiedProblem?.problemTitle).toContain('Zərərverici');
    expect(report.identifiedProblem?.solutionPlan).toContain('İmidakloprid');
    expect(report.plantProtection.specificTreatments?.[0]?.medicineName).toContain('İnsektisid');
  });

  it('Case 6: Missing soil laboratory measurements (Anti-Hallucination Dosage Guardrail)', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        region: 'Aran',
        // Soil metrics omitted
      },
      'en',
      standardWeather
    );

    // Safe dosage notice must issue caution
    expect(report.fertilizerAdvisory.safeDosageNotice).toContain('Caution');
    // Every single prescription must be marked guarded
    expect(report.fertilizerAdvisory.prescriptions.every((p) => p.isGuardedEstimate)).toBe(true);
    // Prescriptions must NOT contain quantitative kg/ha rates
    report.fertilizerAdvisory.prescriptions.forEach((p) => {
      expect(p.estimatedRate).not.toMatch(/\d+\s*(?:-|–|\b)\s*\d*\s*kg\/ha/i);
    });
    // Uncertainties must flag missing soil test
    expect(report.uncertaintiesAndGaps.some((g) => g.toLowerCase().includes('soil'))).toBe(true);
  });

  it('Case 7: Verified soil laboratory measurements unlock calibrated dosing', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        region: 'Aran',
        soilMetrics: {
          ph: 6.8,
          nitrogenPpm: 28,
          phosphorusPpm: 19,
          potassiumPpm: 190,
        },
      },
      'en',
      standardWeather
    );

    expect(report.fertilizerAdvisory.safeDosageNotice).toContain('calibrated');
    expect(report.fertilizerAdvisory.prescriptions.some((p) => !p.isGuardedEstimate)).toBe(true);
    expect(report.fertilizerAdvisory.prescriptions[0].estimatedRate).toContain('kg/ha');
  });

  it('Case 8: Alkaline soil condition (pH 7.8) evaluated accurately', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        region: 'Aran',
        soilMetrics: {
          ph: 7.8,
          nitrogenPpm: 35,
        },
      },
      'en',
      standardWeather
    );

    const phEvaluation = report.soilFertility.metrics.find((m) => m.parameter.includes('pH'));
    expect(phEvaluation?.status).toBe('high');
  });

  it('Case 9: Weather hazard — Heavy rainfall forecast (>25mm cumulative rain)', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        region: 'Aran',
      },
      'en',
      heavyRainWeather
    );

    // Synthesis warns of rainfall and drainage
    expect(report.weatherSynthesis?.irrigationImpact).toContain('recharges the root zone');
    expect(report.weatherSynthesis?.fertilizerImpact).toContain('Avoid surface broadcast');
    // Action 1 addresses pre-rain drainage
    expect(report.actionSteps[0].title).toContain('Pre-Rain Drainage');
  });

  it('Case 10: Weather hazard — High wind gusts (>22 km/h) spray drift prevention', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        region: 'Aran',
      },
      'en',
      highWindWeather
    );

    expect(report.weatherSynthesis?.sprayWindowRecommendation).toContain('Hold foliar');
    expect(report.weatherSynthesis?.sprayWindowRecommendation).toContain('drift');
  });

  it('Case 11: Weather hazard — Heatwave alert (avgMaxTemp >= 32°C)', () => {
    const scoreNormal = calculateDynamicHealthScore({}, true, standardWeather, 'mild');
    const scoreHeatwave = calculateDynamicHealthScore({}, true, heatwaveWeather, 'mild');

    // Heatwave imposes physiological abiotic stress penalty
    expect(scoreHeatwave).toBeLessThan(scoreNormal);
  });

  it('Case 12: Transparent Weather Fallback Attribution', () => {
    const fallbackWeather = getFallback7DayWeather({ lat: 40.6, lon: 47.1, name: 'Aran' }, 'en');

    expect(fallbackWeather.isSimulated).toBe(true);
    expect(fallbackWeather.sourceType).toBe('regional-historical-model');
    expect(fallbackWeather.locationName).toBe('Aran');
  });

  it('Case 13: Localized Agronomic RAG retrieval for Azerbaijani Cotton', () => {
    const refs = retrieveAgronomicContext(
      {
        crop: 'Cotton',
        mainProblem: 'alaq otları və gübrələmə norması',
      },
      3
    );

    expect(refs.length).toBeGreaterThanOrEqual(1);
    expect(refs[0].chunk.crops.map((c) => c.toLowerCase())).toContain('cotton');
    expect(refs[0].chunk.author).toBeTruthy();
    expect(refs[0].chunk.year).toBeGreaterThanOrEqual(2016);
    expect(refs[0].score).toBeGreaterThan(0);
  });

  it('Case 14: Obscure/uncovered crop scenario gracefully retrieves general agronomic science', () => {
    const refs = retrieveAgronomicContext(
      {
        crop: 'Saffron',
        mainProblem: 'Torpaq nəmliyi və drenaj',
      },
      2
    );

    // Falls back cleanly to general agronomic literature without error
    expect(refs.length).toBeGreaterThanOrEqual(1);
    expect(refs[0].chunk.title).toBeTruthy();
  });

  it('Case 15: Vague/insufficient problem description produces safe balanced baseline', () => {
    const report = generateMockAdvisoryReport(
      {
        crop: 'Wheat',
        mainProblem: '',
      },
      'en',
      standardWeather
    );

    expect(report.summaryDiagnosis).toBeDefined();
    expect(report.identifiedProblem?.severity).toBe('moderate');
    expect(report.actionSteps.length).toBeGreaterThanOrEqual(3);
  });

  it('Case 16: Dynamic Health Score multi-factor sensitivity validation', () => {
    // Clean farm with optimal soil and mild problem
    const healthyScore = calculateDynamicHealthScore(
      { soilMetrics: { ph: 6.8, nitrogenPpm: 38, salinityEc: 1.0 } },
      true,
      standardWeather,
      'mild'
    );

    // Stressed farm with acute problems, missing lab data, and critical weed infestation
    const stressedScore = calculateDynamicHealthScore(
      {},
      false,
      heavyRainWeather,
      'critical'
    );

    expect(healthyScore).toBeGreaterThanOrEqual(85);
    expect(stressedScore).toBeLessThan(healthyScore);
    expect(stressedScore).toBeGreaterThanOrEqual(35);
    expect(stressedScore).toBeLessThanOrEqual(75);
  });
});
