import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getFallback7DayWeather, getCoordinatesForLocation } from '../src/lib/weatherService';
import { WeatherAnalysisCard } from '../src/components/dashboard/WeatherAnalysisCard';
import { LanguageProvider } from '../src/i18n/LanguageContext';
import { generateGeminiAdvisoryReport } from '../src/lib/geminiAdvisor';
import { generateMockAdvisoryReport } from '../src/lib/mockAdvisory';

describe('Weather Service & Coordinates', () => {
  it('resolves coordinates for known Azerbaijani agricultural regions and districts', () => {
    const aran = getCoordinatesForLocation('Aran', 'Yevlax');
    expect(aran.lat).toBeCloseTo(40.6172);
    expect(aran.lon).toBeCloseTo(47.15);

    const barda = getCoordinatesForLocation('Karabakh', 'Bərdə');
    expect(barda.lat).toBeCloseTo(40.3758);

    const fallback = getCoordinatesForLocation('UnknownRegion');
    expect(fallback.lat).toBeDefined();
    expect(fallback.lon).toBeDefined();
  });

  it('generates consistent 7-day fallback weather forecast dataset with summary metrics', () => {
    const coords = { lat: 40.6172, lon: 47.15, name: 'Aran / Yevlakh' };
    const weather = getFallback7DayWeather(coords, 'az');

    expect(weather.locationName).toBe('Aran / Yevlakh');
    expect(weather.daily).toHaveLength(7);
    expect(weather.summary.totalRainfallMm).toBeGreaterThanOrEqual(0);
    expect(weather.summary.avgMaxTemp).toBeGreaterThan(0);
    expect(weather.summary.maxWindSpeedKmH).toBeGreaterThan(0);

    const day1 = weather.daily[0];
    expect(day1.tempMax).toBeGreaterThan(day1.tempMin);
    expect(day1.conditionDescription).toBeDefined();
  });
});

describe('WeatherAnalysisCard Component', () => {
  it('renders 7-day forecast cards and AI meteorological synthesis banner in Azerbaijani', () => {
    const coords = { lat: 40.6172, lon: 47.15, name: 'Aran / Yevlakh' };
    const weatherData = getFallback7DayWeather(coords, 'az');
    const weatherSynthesis = {
      headline: 'Aran bölgəsində 7 günlük aqro-meteoroloji xülasə',
      summary: 'Qarşıdakı günlərdə 11.7 mm yağıntı gözlənilir.',
      irrigationImpact: 'Suvarma normasını 8 mm azaldın və yağış günü nasosları dayandırın.',
      fertilizerImpact: 'Yağışdan əvvəl səpin gübrələri verməyin.',
      protectionImpact: 'Rütubət göbələk riskini artırır.',
      sprayWindowRecommendation: 'Küləksiz səhər saatlarında çiləmə aparın.',
    };

    render(
      <LanguageProvider initialLanguage="az">
        <WeatherAnalysisCard
          weatherData={weatherData}
          weatherSynthesis={weatherSynthesis}
        />
      </LanguageProvider>
    );

    // Verify Title & Location
    expect(screen.getByText('7 Günlük Hava Proqnozu & AI Aqronomik Nəticələri')).toBeInTheDocument();
    expect(screen.getByText(/Aran \/ Yevlakh/)).toBeInTheDocument();

    // Verify AI synthesis texts
    expect(screen.getByText('Aran bölgəsində 7 günlük aqro-meteoroloji xülasə')).toBeInTheDocument();
    expect(screen.getByText('Suvarma normasını 8 mm azaldın və yağış günü nasosları dayandırın.')).toBeInTheDocument();
    expect(screen.getByText('Yağışdan əvvəl səpin gübrələri verməyin.')).toBeInTheDocument();

    // Verify impact column headings
    expect(screen.getByText('Suvarmaya Təsiri')).toBeInTheDocument();
    expect(screen.getByText('Gübrələmə Təqvimi')).toBeInTheDocument();
    expect(screen.getByText('Çiləmə & Mühafizə Pəncərəsi')).toBeInTheDocument();
  });
});

describe('Gemini Advisor & Weather Engine Integration', () => {
  it('incorporates weatherData into mockAdvisory to adjust irrigation and generate weatherSynthesis', () => {
    const coords = { lat: 40.6172, lon: 47.15, name: 'Aran / Yevlakh' };
    const weather = getFallback7DayWeather(coords, 'az');

    const report = generateMockAdvisoryReport(
      { region: 'Aran', crop: 'Cotton', irrigationMethod: 'Drip' },
      'az',
      weather
    );

    expect(report.weatherData).toBeDefined();
    expect(report.weatherSynthesis).toBeDefined();
    expect(report.weatherSynthesis?.headline).toContain('Aran / Yevlakh');
    expect(report.irrigationAdvisory.waterRequirementMmPerWeek).toBeLessThanOrEqual(32);
    expect(report.actionSteps.length).toBeGreaterThanOrEqual(3);
  });

  it('falls back gracefully to rules engine when GEMINI_API_KEY is unset without throwing errors', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const coords = { lat: 40.6172, lon: 47.15, name: 'Aran / Yevlakh' };
    const weather = getFallback7DayWeather(coords, 'en');

    const { report, source } = await generateGeminiAdvisoryReport(
      { crop: 'Wheat', region: 'Aran' },
      weather,
      'en'
    );

    expect(source).toBe('rules-engine');
    expect(report.summaryDiagnosis).toBeDefined();
    expect(report.weatherSynthesis).toBeDefined();

    process.env.GEMINI_API_KEY = originalKey;
  });
});
