import React from 'react';
import { BookOpen, ExternalLink, Bookmark } from 'lucide-react';
import { DataBadge } from '../shared/DataBadge';

interface CitationItem {
  title: string;
  source: string;
  year: number;
  relevance: string;
}

interface CitationsCardProps {
  citations: CitationItem[];
  className?: string;
}

export function CitationsCard({ citations, className = '' }: CitationsCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Scientific Literature & Agronomic Citations
            </h3>
            <span className="text-[11px] text-slate-500">
              Correlated research guides and extension publications
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          Peer-Reviewed Knowledge Base
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {citations.map((cite, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 text-xs space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-slate-900 leading-snug">
                {cite.title}
              </span>
              <span className="shrink-0 rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                {cite.year}
              </span>
            </div>

            <p className="text-slate-500 text-[11px]">
              <span className="font-medium text-slate-700">Source: </span>
              {cite.source}
            </p>

            <p className="text-slate-600 leading-relaxed text-[11px] border-t border-slate-100 pt-1">
              <span className="font-medium text-mint-900">Agronomic Application: </span>
              {cite.relevance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
