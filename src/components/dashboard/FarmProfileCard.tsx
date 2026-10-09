'use client';

import React from 'react';
import { UserCheck, HelpCircle, FileText } from 'lucide-react';
import { FarmSubmissionPayload } from '../../types/farm';
import { DataBadge } from '../shared/DataBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface FarmProfileCardProps {
  profile: FarmSubmissionPayload;
  className?: string;
}

export function FarmProfileCard({ profile, className = '' }: FarmProfileCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('dashboard.farmProfileTitle')}</h3>
            <span className="text-[11px] text-slate-500">{t('dashboard.farmProfileSub')}</span>
          </div>
        </div>

        <DataBadge variant="submitted" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        {/* Region & District */}
        <div className="rounded-lg bg-slate-50 p-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {t('dashboard.location')}
          </span>
          <p className="mt-1 font-semibold text-slate-900 truncate">
            {profile.region}
            {profile.district && <span className="font-normal text-slate-600">, {profile.district}</span>}
          </p>
        </div>

        {/* Field Area */}
        <div className="rounded-lg bg-slate-50 p-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {t('dashboard.totalArea')}
          </span>
          <p className="mt-1 font-semibold text-slate-900">
            {profile.farmAreaHectares
              ? `${profile.farmAreaHectares} ${t('step1.hectaresUnit')}`
              : t('common.notSpecified')}
          </p>
        </div>

        {/* Crop & Stage */}
        <div className="rounded-lg bg-slate-50 p-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {t('dashboard.cropPhenology')}
          </span>
          <p className="mt-1 font-semibold text-slate-900 truncate">
            {profile.crop}
            {profile.growthStage && <span className="font-normal text-slate-600"> ({profile.growthStage})</span>}
          </p>
        </div>

        {/* Soil & Irrigation */}
        <div className="rounded-lg bg-slate-50 p-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {t('dashboard.soilIrrigation')}
          </span>
          <p className="mt-1 font-semibold text-slate-900 truncate">
            {(profile.soilType && t(`options.soils.${profile.soilType}`)) || profile.soilType || t('common.unspecified')} •{' '}
            {(profile.irrigationMethod && t(`options.irrigation.${profile.irrigationMethod}`)) || profile.irrigationMethod || t('common.unspecified')}
          </p>
        </div>
      </div>

      {/* Primary Inquiry */}
      <div className="mt-3.5 rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          {t('dashboard.reportedProblem')}
        </span>
        <p className="mt-1 text-xs leading-relaxed text-slate-800 font-medium">
          "{profile.mainProblem}"
        </p>
      </div>

      {/* Uploaded Documents / Photos badge */}
      {((profile.uploadedDocumentNames && profile.uploadedDocumentNames.length > 0) ||
        (profile.uploadedPhotoNames && profile.uploadedPhotoNames.length > 0)) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <FileText className="w-3.5 h-3.5 text-mint-600" />
          <span>{t('dashboard.attachedEvidence')}</span>
          {profile.uploadedDocumentNames?.map((doc) => (
            <span key={doc} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-slate-700">
              {doc}
            </span>
          ))}
          {profile.uploadedPhotoNames?.map((photo) => (
            <span key={photo} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-slate-700">
              {photo}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
