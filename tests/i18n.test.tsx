import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../src/i18n/LanguageContext';
import { translations } from '../src/i18n/translations';

function TestConsumer() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-title">{t('hero.title')}</span>
      <span data-testid="cta-btn">{t('wizard.submitBtn')}</span>
      <button onClick={() => setLanguage('az')}>Switch to AZ</button>
      <button onClick={() => setLanguage('en')}>Switch to EN</button>
    </div>
  );
}

describe('LanguageContext and Translations', () => {
  it('contains comprehensive translations for both English and Azerbaijani', () => {
    expect(translations.en).toBeDefined();
    expect(translations.az).toBeDefined();
    expect(translations.az.common.platformName).toBe('AgroMint AI');
    expect(translations.az.wizard.submitBtn).toContain('Təhlil');
  });

  it('allows toggling between English and Azerbaijani dynamically', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    // Initial state (default 'en' or 'az')
    expect(screen.getByTestId('translated-title')).toBeInTheDocument();

    // Switch to AZ
    fireEvent.click(screen.getByText('Switch to AZ'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('az');
    expect(screen.getByTestId('cta-btn')).toHaveTextContent(/Təsərrüfatımı Təhlil Et/i);

    // Switch to EN
    fireEvent.click(screen.getByText('Switch to EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('cta-btn')).toHaveTextContent(/Analyze My Farm/i);
  });
});
