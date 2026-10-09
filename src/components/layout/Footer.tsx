'use client';

import React from 'react';
import { Sprout, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-600 text-white">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900">AgroMint AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              {language === 'az'
                ? 'AgroMint AI fermer tərəfindən təqdim olunan sahə parametrlərini elmi ədəbiyyat, torpaq analizi və bitkiyə xas aqronomik biliklərlə uzlaşdıran süni intellekt aqrar platformasıdır. Sadə çatbot deyil.'
                : 'AgroMint AI is an agricultural intelligence platform that correlates farmer-provided field parameters alongside curated scientific literature, soil analysis data, and crop-specific agronomic knowledge. Not a generic chatbot.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-600" />
              <span>
                {language === 'az'
                  ? 'Aydın məlumat çatışmazlığı xəbərdarlıqları ilə sübuta əsaslanan tövsiyələr.'
                  : 'Evidence-based recommendations with explicit uncertainty warnings.'}
              </span>
            </div>
          </div>

          {/* Platform Pillars */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {language === 'az' ? 'Platforma Bölmələri' : 'Platform Features'}
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <a href="#farm-intake-section" className="hover:text-mint-700 transition">
                  {t('wizard.title')}
                </a>
              </li>
              <li>
                <a href="#farm-intake-section" className="hover:text-mint-700 transition">
                  {language === 'az' ? 'Torpaq Qida Modelləşdirməsi' : 'Soil Nutrient Modeling'}
                </a>
              </li>
              <li>
                <a href="#farm-intake-section" className="hover:text-mint-700 transition">
                  {language === 'az' ? 'Dinamik Fenologiya İdarəetməsi' : 'Dynamic Phenology Timing'}
                </a>
              </li>
              <li>
                <a href="#farm-intake-section" className="hover:text-mint-700 transition">
                  {language === 'az' ? 'Elmi Ədəbiyyat İstinadları' : 'Scientific Citations Engine'}
                </a>
              </li>
            </ul>
          </div>

          {/* Partner Notice / AgroSphere External */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {language === 'az' ? 'Aqro Ekosistem' : 'Ecosystem & Services'}
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              {language === 'az'
                ? 'AgroMint AI tam müstəqil fəaliyyət göstərir. Gübrə, dərman və aqronom məsləhətləri AgroSphere platformasına xarici tərəfdaşlıq keçidi ilə təqdim olunur.'
                : 'AgroMint AI operates independently. Supplies and agronomist consultations are linked contextually to verified marketplaces like AgroSphere.'}
            </p>
            <div className="mt-3">
              <a
                href="https://agrosphere.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {language === 'az' ? 'AgroSphere Platformasına Keçid' : 'Visit AgroSphere Marketplace'}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AgroMint AI. {t('common.allRightsReserved')}</p>
          <p className="flex items-center gap-1">
            {t('common.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
