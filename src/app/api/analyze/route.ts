import { NextRequest, NextResponse } from 'next/server';
import { fetch7DayWeather } from '../../../lib/weatherService';
import { generateGeminiAdvisoryReport } from '../../../lib/geminiAdvisor';
import { generateMockAdvisoryReport } from '../../../lib/mockAdvisory';
import { FarmSubmissionPayload } from '../../../types/farm';

// In-memory sliding window rate limiter
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(ip, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - timestamps.length };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let payload: Partial<FarmSubmissionPayload> = {};
  let language: 'en' | 'az' = 'en';

  // Extract client IP for rate limiting
  const forwarded = req.headers.get('x-forwarded-for');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  const { allowed, remaining } = checkRateLimit(clientIp);
  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Rate limit exceeded (Sorğu limiti aşıldı). AgroMint API allows a maximum of 10 requests per minute per IP.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await req.json();
    payload = body.payload || {};
    language = body.language === 'az' ? 'az' : 'en';

    // 1. Fetch live 7-day weather for farm's region / district
    const weather = await fetch7DayWeather(payload.region, payload.district, language);

    // 2. Generate AI-powered synthesis using Gemini + live weather context
    const { report, source } = await generateGeminiAdvisoryReport(payload, weather, language);

    const latencyMs = Date.now() - startTime;
    // Estimated token consumption: ~1,800 prompt tokens + ~1,200 completion tokens
    // Gemini 3.1 Flash Lite rates: $0.075/1M input, $0.30/1M output
    const estimatedCostUsd = source === 'gemini' ? 0.000495 : 0.0;

    return NextResponse.json({
      success: true,
      report,
      weather,
      source,
      meta: {
        latencyMs,
        estimatedCostUsd,
        estimatedCostAzn: Math.round(estimatedCostUsd * 1.7 * 100000) / 100000,
        rateLimit: {
          limit: MAX_REQUESTS_PER_WINDOW,
          remaining,
        },
      },
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
      meta: {
        latencyMs: Date.now() - startTime,
        estimatedCostUsd: 0.0,
        rateLimit: {
          limit: MAX_REQUESTS_PER_WINDOW,
          remaining,
        },
      },
    });
  }
}
