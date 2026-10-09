import React from 'react';
import { ArrowDown, Sprout, FileCheck2, ShieldAlert, Cpu } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 overflow-hidden opacity-30 blur-3xl">
        <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-mint-300 via-emerald-200 to-green-100 opacity-60" />
      </div>

      <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-mint-200 bg-mint-50/80 px-3.5 py-1 text-xs font-semibold text-mint-800 shadow-sm backdrop-blur">
          <Sprout className="h-3.5 w-3.5 text-mint-600" />
          <span>Agricultural Intelligence Platform</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">Context-Aware Field Diagnostics</span>
        </div>

        {/* Main Title */}
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
          Context-Aware Agronomic Intelligence for Modern Farms
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base text-slate-600 leading-relaxed sm:text-lg max-w-2xl mx-auto">
          Receive tailored agricultural diagnostics and soil-calibrated recommendations by providing your field parameters.
          Grounded in verified scientific references, not generic chatbot answers.
        </p>

        {/* 3 Core Value Props */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-3xl mx-auto text-left">
          <div className="rounded-xl border border-slate-200 bg-white/80 p-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <FileCheck2 className="w-4 h-4 text-mint-600" />
              <span>Evidence-Based</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Synthesizes your soil tests, growth stage, and curated scientific literature.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/80 p-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Cpu className="w-4 h-4 text-mint-600" />
              <span>Structured Diagnostics</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Executive 10-card advisory dossier instead of generic conversational bubbles.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/80 p-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Safe Dosage Guards</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Transparent disclosure of data gaps to prevent chemical over-application.
            </p>
          </div>
        </div>

        {/* CTA scroll down */}
        <div className="mt-8">
          <a
            href="#farm-intake-section"
            className="inline-flex items-center gap-2 text-xs font-semibold text-mint-700 hover:text-mint-800 transition group"
          >
            <span>Proceed directly to Farm Intake Wizard</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
