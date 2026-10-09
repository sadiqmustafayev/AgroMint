import { describe, it, expect } from 'vitest';
import { generateGeminiAdvisoryReport } from '../src/lib/geminiAdvisor';
import { generateMockAdvisoryReport } from '../src/lib/mockAdvisory';
import { getFallback7DayWeather } from '../src/lib/weatherService';
import fs from 'fs';

// Ensure GEMINI_API_KEY is loaded from .env.local if present
if (!process.env.GEMINI_API_KEY && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match) {
    process.env.GEMINI_API_KEY = match[1].trim();
  }
}

describe('Gemini Advisor RAG Integration', () => {
  it('incorporates retrieved Azerbaijani textbook citations into mock advisory report', () => {
    const weather = getFallback7DayWeather({ lat: 40.6, lon: 47.1, name: 'Aran' }, 'az');
    const report = generateMockAdvisoryReport(
      { crop: 'Cotton', mainProblem: 'Alaq otları və gübrələmə norması', region: 'Aran' },
      'az',
      weather
    );

    expect(report.scientificCitations.length).toBeGreaterThanOrEqual(1);
    const hasTextbookCitation = report.scientificCitations.some(c =>
      c.title.includes('Bitkiçilik') ||
      c.title.includes('gübrə') ||
      c.title.includes('Torpaq') ||
      c.source.includes('Məmmədov')
    );
    expect(hasTextbookCitation).toBe(true);
  });

  it('incorporates retrieved Azerbaijani textbook citations into Gemini live advisory report', async () => {
    const weather = getFallback7DayWeather({ lat: 40.6, lon: 47.1, name: 'Aran' }, 'az');
    const { report, source } = await generateGeminiAdvisoryReport(
      { crop: 'Cotton', mainProblem: 'Alaq otları sahəni basıb və qozalar gec açılır', region: 'Aran' },
      weather,
      'az'
    );

    expect(report.scientificCitations.length).toBeGreaterThanOrEqual(1);
    const citation = report.scientificCitations[0];
    expect(citation.title).toBeTruthy();
    expect(citation.source).toBeTruthy();
  }, 30000);
});
