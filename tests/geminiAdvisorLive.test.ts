import { describe, it, expect } from 'vitest';
import { generateGeminiAdvisoryReport } from '../src/lib/geminiAdvisor';
import { getFallback7DayWeather } from '../src/lib/weatherService';
import fs from 'fs';

describe('Gemini Advisor Live Generation', () => {
  it('generates a real report using Gemini AI with source "gemini" and valid field synthesis', async () => {
    // Read API key from .env.local
    if (fs.existsSync('.env.local')) {
      const envContent = fs.readFileSync('.env.local', 'utf-8');
      const match = envContent.match(/GEMINI_API_KEY=(.*)/);
      if (match) {
        process.env.GEMINI_API_KEY = match[1].trim();
      }
    }

    const coords = { lat: 40.6172, lon: 47.15, name: 'Aran / Yevlakh' };
    const weather = getFallback7DayWeather(coords, 'az');

    const payload = {
      region: 'Aran',
      district: 'Yevlax',
      crop: 'Cotton',
      growthStage: 'Squaring / Flowering',
      farmAreaHectares: 25,
      mainProblem: 'Alaq otları intensiv artıb və pambıq qozaları gec açılır',
    };

    const { report, source } = await generateGeminiAdvisoryReport(payload, weather, 'az');

    expect(source).toBe('gemini');
    expect(report.source).toBe('gemini');
    expect(report.id).toMatch(/^agro-gemini-/);
    expect(report.summaryDiagnosis).toBeTruthy();
    expect(report.identifiedProblem).toBeDefined();
    expect(report.actionSteps.length).toBeGreaterThanOrEqual(1);
    expect(report.weatherSynthesis).toBeDefined();
  }, 25000);
});
