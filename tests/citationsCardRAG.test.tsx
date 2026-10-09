import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CitationsCard } from '../src/components/dashboard/CitationsCard';
import { LanguageProvider } from '../src/i18n/LanguageContext';

describe('CitationsCard RAG Attribution', () => {
  it('displays Azerbaijani textbook citation with RAG grounding badge', () => {
    const citations = [
      {
        title: 'Bitkiçilik (dərslik)',
        source: 'Q.Y. Məmmədov, M.M. İsmayılov',
        year: 2018,
        relevance: 'Pambıq becərilməsində alaq otlarına qarşı herbisid normaları',
      },
    ];

    render(
      <LanguageProvider defaultLanguage="az">
        <CitationsCard citations={citations} />
      </LanguageProvider>
    );

    expect(screen.getByText('Bitkiçilik (dərslik)')).toBeInTheDocument();
    expect(screen.getByText(/Q.Y. Məmmədov/)).toBeInTheDocument();
    expect(screen.getByText('RAG • Yerli Elmi Ədəbiyyat')).toBeInTheDocument();
  });

  it('displays English RAG grounding badge when defaultLanguage is en', () => {
    const citations = [
      {
        title: 'Crop Husbandry (Textbook)',
        source: 'Q.Y. Mammadov, M.M. Ismayilov',
        year: 2018,
        relevance: 'Cotton weed eradication standards',
      },
    ];

    render(
      <LanguageProvider defaultLanguage="en">
        <CitationsCard citations={citations} />
      </LanguageProvider>
    );

    expect(screen.getByText('RAG • Local Scientific Literature')).toBeInTheDocument();
  });
});
