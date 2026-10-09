import React from 'react';
import { ExternalLink, ShoppingBag, ShieldCheck, UserCheck, Wrench } from 'lucide-react';

interface AgroSphereLinkProps {
  title: string;
  description: string;
  destinationUrl: string;
  serviceType?: 'fertilizer' | 'protection' | 'agronomist' | 'equipment';
  callToActionText?: string;
  className?: string;
}

export function AgroSphereLink({
  title,
  description,
  destinationUrl,
  serviceType = 'fertilizer',
  callToActionText = 'Explore on AgroSphere',
  className = '',
}: AgroSphereLinkProps) {
  const getIcon = () => {
    switch (serviceType) {
      case 'protection':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'agronomist':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'equipment':
        return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 'fertilizer':
      default:
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div
      className={`rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-mint-50/40 p-4 transition-all hover:border-emerald-300 hover:shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald-100/70 p-2 text-emerald-700">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                AgroSphere Partner Link
              </span>
              <span className="text-[10px] rounded bg-emerald-100/60 px-1.5 py-0.5 font-medium text-emerald-800">
                External
              </span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-900">{title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-emerald-100/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Independent service on the AgroSphere marketplace
        </span>
        <a
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          {callToActionText}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
