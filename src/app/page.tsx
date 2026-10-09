'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { FarmWizard } from '../components/farm-form/FarmWizard';
import { FarmSubmissionPayload } from '../types/farm';

export default function HomePage() {
  const router = useRouter();

  const handleFarmSubmit = (payload: FarmSubmissionPayload) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <section id="farm-intake-section" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <div className="mb-4 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-mint-700">
              Interactive Field Evaluation
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Start Agricultural Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide as much detail as you have available. Unknown fields can be skipped freely.
            </p>
          </div>

          <FarmWizard onSubmit={handleFarmSubmit} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
