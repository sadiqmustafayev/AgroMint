'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { FarmWizard } from '../components/farm-form/FarmWizard';
import { LoadingAnalysis } from '../components/analysis/LoadingAnalysis';
import { FarmSubmissionPayload } from '../types/farm';
import { useLanguage } from '../i18n/LanguageContext';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleFarmSubmit = (payload: FarmSubmissionPayload) => {
    setIsNavigating(true);
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('agromint_submission', JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Session storage write error:', e);
    }

    // Direct user to analysis page
    router.push('/analyze');
  };

  if (isNavigating) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/60">
        <Navbar />
        <main className="flex-1 py-12 flex items-center justify-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <LoadingAnalysis durationMs={8000} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <section id="farm-intake-section" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <div className="mb-4 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-mint-700">
              {t('intakeHeader.badge')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {t('intakeHeader.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('intakeHeader.subtitle')}
            </p>
          </div>

          <FarmWizard onSubmit={handleFarmSubmit} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
