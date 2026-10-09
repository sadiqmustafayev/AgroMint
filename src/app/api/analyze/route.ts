import { NextRequest, NextResponse } from 'next/server';
import { fetch7DayWeather } from '../../../lib/weatherService';
import { generateGeminiAdvisoryReport } from '../../../lib/geminiAdvisor';
import { generateMockAdvisoryReport } from '../../../lib/mockAdvisory';
import { FarmSubmissionPayload } from '../../../types/farm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: Partial<FarmSubmissionPayload> = body.payload || {};
    const language: 'en' | 'az' = body.language === 'az' ? 'az' : 'en';

    // 1. Fetch live 7-day weather for farm's region / district
    const weather = await fetch7DayWeather(payload.region, payload.district, language);

    // 2. Generate AI-powered synthesis using Gemini + live weather context
    const { report, source } = await generateGeminiAdvisoryReport(payload, weather, language);

    return NextResponse.json({
      success: true,
      report,
      weather,
      source,
    });
  } catch (err) {
    console.error('Error in /api/analyze route:', err);

    // Resilient fallback: return calibrated mock report rather than throwing 500
    const fallbackReport = generateMockAdvisoryReport({}, 'en');
    return NextResponse.json({
      success: true,
      report: fallbackReport,
      source: 'rules-engine-emergency',
    });
  }
}
