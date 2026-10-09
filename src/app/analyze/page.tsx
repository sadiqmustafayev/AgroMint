'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { LoadingAnalysis } from '../../components/analysis/LoadingAnalysis';
import { ResultsDashboard } from '../../components/dashboard/ResultsDashboard';
import { generateMockAdvisoryReport } from '../../lib/mockAdvisory';
import { FarmSubmissionPayload } from '../../types/farm';
import { AgronomicAdvisoryReport } from '../../types/advisory';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AnalyzePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<AgronomicAdvisoryReport | null>(null);
  const [submissionPayload, setSubmissionPayload] = useState<Partial<FarmSubmissionPayload> | null>(null);

  useEffect(() => {
    let payload: Partial<FarmSubmissionPayload> = {};
    try {
      if (typeof window !== 'undefined') {
        const stored = window.sessionStorage.getItem('agromint_submission');
        if (stored) {
          payload = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('Error reading session data:', e);
    }

    // Default sample if accessed directly without submission
    if (!payload.region && !payload.crop) {
      payload = {
        region: language === 'az' ? 'Aran Kənd Təsərrüfatı Hövzəsi' : 'Aran Agricultural Basin',
        district: 'Yevlax',
        farmAreaHectares: 24.5,
        crop: 'Cotton',
        growthStage: 'Squaring / Flowering',
        soilType: 'Loamy',
        soilMode: 'manual',
        soilMetrics: {
          ph: 7.2,
          organicMatterPct: 2.1,
          nitrogenPpm: 28,
          phosphorusPpm: 19,
          potassiumPpm: 190,
          salinityEc: 1.1,
        },
        irrigationMethod: 'Drip Irrigation',
        waterSource: 'Deep Borewell / Groundwater',
        mainProblem:
          language === 'az'
            ? 'Azot yemləmə normasının tənzimlənməsi və ilkin sorucu zərərverici hədlərinin monitorinqi.'
            : 'Optimizing nitrogen top-dressing split application and monitoring early sucking pest thresholds.',
      };
    }

    setSubmissionPayload(payload);

    // Initial fallback while fetching live AI data
    const initialReport = generateMockAdvisoryReport(payload, language);
    setReport(initialReport);

    // Fetch live 7-day weather + Gemini AI analysis in browser environment
    if (typeof window !== 'undefined' && window.location?.origin) {
      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, language }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.report) {
            setReport(data.report);
          }
        })
        .catch(() => {
          // Graceful fallback to initial local report
        });
    }
  }, []);

  // Update report reactively if user switches language on results page
  useEffect(() => {
    if (submissionPayload) {
      if (typeof window !== 'undefined' && window.location?.origin) {
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: submissionPayload, language }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.report) {
              setReport(data.report);
            } else {
              setReport(generateMockAdvisoryReport(submissionPayload, language));
            }
          })
          .catch(() => {
            setReport(generateMockAdvisoryReport(submissionPayload, language));
          });
      } else {
        setReport(generateMockAdvisoryReport(submissionPayload, language));
      }
    }
  }, [language]);

  const handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('agromint_submission');
      }
    } catch (e) {
      // ignore
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingAnalysis onComplete={() => setIsLoading(false)} durationMs={2000} />
          ) : (
            report && <ResultsDashboard report={report} onReset={handleReset} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
