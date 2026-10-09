import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../src/i18n/LanguageContext';
import { translations } from '../src/i18n/translations';
import { generateMockAdvisoryReport } from '../src/lib/mockAdvisory';
import { StepLocation } from '../src/components/farm-form/StepLocation';
import { StepCrop } from '../src/components/farm-form/StepCrop';

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

    // Initial state
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

  it('generates advisory reports in Azerbaijani when lang=az', () => {
    const reportAz = generateMockAdvisoryReport(
      {
        crop: 'Cotton',
        growthStage: 'Squaring / Flowering',
        region: 'Aran',
        mainProblem: 'Yarpaq saralması',
      },
      'az'
    );

    expect(reportAz.farmProfile.crop).toBe('Pambıq');
    expect(reportAz.summaryDiagnosis).toContain('aqronomik təhlili');
    expect(reportAz.mainFindings[0]).toContain('mərhələsindədir');
    expect(reportAz.cropSpecificGuidance.optimalTemperature).toContain('Gündüz');
    expect(reportAz.fertilizerAdvisory.prescriptions[0].timing).toContain('hissəli yemləmə');
    expect(reportAz.fertilizerAdvisory.agroSphereLink?.title).toContain('AgroSphere');
    expect(reportAz.irrigationAdvisory.managementTips[0]).toContain('suvarın');
    expect(reportAz.plantProtection.diagnosedStressors[0]).toContain('mənənə');
    expect(reportAz.actionSteps[0].title).toContain('Suvarmanı Tənzimləyin');
  });

  it('renders form components with Azerbaijani labels in az mode', () => {
    render(
      <LanguageProvider defaultLanguage="az">
        <StepLocation
          region="Aran"
          district="Bərdə"
          onChange={() => {}}
        />
        <StepCrop
          selectedCrop="Cotton"
          selectedStage="Squaring / Flowering"
          onCropChange={() => {}}
          onStageChange={() => {}}
          onPreviousCropChange={() => {}}
        />
      </LanguageProvider>
    );

    // Check localized titles
    expect(
      screen.getByText(/Təsərrüfatın Yerləşməsi və Sahə Ölçüləri/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bitki Növü və İnkişaf Fenologiyası/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Pambıq/i).length).toBeGreaterThan(0);
  });
});
