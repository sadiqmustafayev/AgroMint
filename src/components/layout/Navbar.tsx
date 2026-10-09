'use client';

import React from 'react';
import { Sprout, BookOpen, ShieldCheck, User, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-mint-600 to-emerald-500 text-white shadow-md shadow-mint-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">
                AgroMint AI
              </span>
              <span className="rounded-full bg-mint-100/80 px-2 py-0.5 text-[10px] font-semibold text-mint-800">
                v2.0
              </span>
            </div>
            <span className="block text-[11px] text-slate-500 font-medium -mt-0.5">
              {t('common.platformSubtitle')}
            </span>
          </div>
        </a>

        {/* Navigation links & Guest status */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
            <a href="#farm-intake-section" className="hover:text-mint-700 transition">
              {t('wizard.title')}
            </a>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-600" />
              {t('common.verifiedGuides')}
            </span>
          </div>

          {/* Language Switcher Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('az')}
              className={`rounded-md px-2 py-1 transition ${
                language === 'az'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Azərbaycan dili"
            >
              AZ
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-md px-2 py-1 transition ${
                language === 'en'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t('common.signIn')}</span>
            </a>
            <a
              href="/auth/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-mint-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-mint-700"
            >
              <span className="hidden sm:inline">{t('common.register')}</span>
              <span className="sm:hidden">+</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
