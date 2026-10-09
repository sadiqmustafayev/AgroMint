'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/analyze');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-600 text-white shadow-md shadow-mint-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            {t('common.platformName')}
          </span>
        </a>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {t('auth.registerHeading')}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                {t('auth.fullNameLabel')}
              </label>
              <div className="mt-1">
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder={t('auth.fullNamePlaceholder')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                {t('auth.emailOrPhoneLabel')}
              </label>
              <div className="mt-1">
                <input
                  id="reg-email"
                  type="text"
                  required
                  placeholder={t('auth.emailOrPhonePlaceholder')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                {t('auth.passwordLabel')}
              </label>
              <div className="mt-1">
                <input
                  id="reg-password"
                  type="password"
                  required
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-mint-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              >
                {t('auth.registerBtn')}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('common.backToHome')}
            </a>
            <a
              href="/auth/login"
              className="font-medium text-mint-700 hover:text-mint-800 hover:underline"
            >
              {t('auth.hasAccountPrompt')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
