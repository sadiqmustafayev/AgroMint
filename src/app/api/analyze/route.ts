import { NextRequest, NextResponse } from 'next/server';
import { fetch7DayWeather } from '../../../lib/weatherService';
import { generateGeminiAdvisoryReport } from '../../../lib/geminiAdvisor';
import { generateMockAdvisoryReport } from '../../../lib/mockAdvisory';
import { FarmSubmissionPayload } from '../../../types/farm';

export async function POST(req: NextRequest) {
  let payload: Partial<FarmSubmissionPayload> = {};
  let language: 'en' | 'az' = 'en';

  try {
    const body = await req.json();
    payload = body.payload || {};
    language = body.language === 'az' ? 'az' : 'en';

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

    // Resilient fallback: return calibrated mock report preserving user payload and language
    const fallbackReport = generateMockAdvisoryReport(payload, language);
    fallbackReport.source = 'rules-engine-emergency';
    return NextResponse.json({
      success: true,
      report: fallbackReport,
      source: 'rules-engine-emergency',
    });
  }
}
