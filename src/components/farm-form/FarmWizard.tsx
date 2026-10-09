import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Shield, User, HelpCircle } from 'lucide-react';
import { FarmSubmissionPayload, SoilMetrics } from '../../types/farm';
import { FormProgressBar } from './FormProgressBar';
import { StepLocation } from './StepLocation';
import { StepCrop } from './StepCrop';
import { StepSoilWater } from './StepSoilWater';
import { StepQuestionsMedia } from './StepQuestionsMedia';

const STEP_TITLES = [
  'Location & Field',
  'Crop & Stage',
  'Soil & Irrigation',
  'Field Questions',
];

interface FarmWizardProps {
  onSubmit: (payload: FarmSubmissionPayload) => void;
  isGuest?: boolean;
  className?: string;
}

export function FarmWizard({
  onSubmit,
  isGuest = true,
  className = '',
}: FarmWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [farmAreaHectares, setFarmAreaHectares] = useState<number | undefined>(undefined);

  const [crop, setCrop] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [previousCrop, setPreviousCrop] = useState('');

  const [soilType, setSoilType] = useState('Unknown / Unsure');
  const [soilMode, setSoilMode] = useState<'upload' | 'manual'>('upload');
  const [soilMetrics, setSoilMetrics] = useState<SoilMetrics>({});
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [irrigationMethod, setIrrigationMethod] = useState('Drip Irrigation');
  const [waterSource, setWaterSource] = useState('Deep Borewell / Groundwater');

  const [mainProblem, setMainProblem] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleSoilMetricChange = (field: keyof SoilMetrics, val: number | undefined) => {
    setSoilMetrics((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!region.trim()) {
        setErrorMessage('Please specify or select an Agricultural Region.');
        return false;
      }
    }
    if (step === 2) {
      if (!crop.trim()) {
        setErrorMessage('Please select a Crop to continue.');
        return false;
      }
    }
    // Steps 3 is fully optional; Step 4 requires mainProblem at final submission
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!region.trim()) {
      setCurrentStep(1);
      setErrorMessage('Please specify an Agricultural Region.');
      return;
    }
    if (!crop.trim()) {
      setCurrentStep(2);
      setErrorMessage('Please select a Crop.');
      return;
    }
    if (!mainProblem.trim()) {
      setCurrentStep(4);
      setErrorMessage('Please describe your main agricultural problem or inquiry.');
      return;
    }

    const payload: FarmSubmissionPayload = {
      region,
      district: district || undefined,
      farmAreaHectares: farmAreaHectares || undefined,
      crop,
      growthStage: growthStage || undefined,
      previousCrop: previousCrop || undefined,
      soilType: soilType as any,
      soilMode,
      soilMetrics: soilMode === 'manual' ? soilMetrics : undefined,
      uploadedDocumentNames: uploadedDocs,
      irrigationMethod: irrigationMethod as any,
      waterSource: waterSource as any,
      mainProblem,
      uploadedPhotoNames: uploadedPhotos,
    };

    onSubmit(payload);
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-xl shadow-slate-100/80 ${className}`}
    >
      {/* Top Banner / Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-100 text-mint-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Intelligent Farm Intake Wizard
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-mint-600" />
            <span>Guest Analysis Enabled</span>
          </div>
        </div>

        <FormProgressBar
          currentStep={currentStep}
          totalSteps={4}
          stepTitles={STEP_TITLES}
          onStepClick={(step) => {
            if (step < currentStep || validateStep(currentStep)) {
              setCurrentStep(step);
            }
          }}
        />
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        <div className="min-h-[280px]">
          {currentStep === 1 && (
            <StepLocation
              region={region}
              district={district}
              farmAreaHectares={farmAreaHectares}
              onChange={(field, val) => {
                if (field === 'region') setRegion(val);
                if (field === 'district') setDistrict(val);
                if (field === 'farmAreaHectares') setFarmAreaHectares(val);
              }}
            />
          )}

          {currentStep === 2 && (
            <StepCrop
              selectedCrop={crop}
              selectedStage={growthStage}
              previousCrop={previousCrop}
              onCropChange={setCrop}
              onStageChange={setGrowthStage}
              onPreviousCropChange={setPreviousCrop}
            />
          )}

          {currentStep === 3 && (
            <StepSoilWater
              soilMode={soilMode}
              soilType={soilType}
              soilMetrics={soilMetrics}
              uploadedDocs={uploadedDocs}
              irrigationMethod={irrigationMethod}
              waterSource={waterSource}
              onSoilModeChange={setSoilMode}
              onSoilTypeChange={setSoilType}
              onSoilMetricChange={handleSoilMetricChange}
              onDocsChange={setUploadedDocs}
              onIrrigationChange={setIrrigationMethod}
              onWaterSourceChange={setWaterSource}
            />
          )}

          {currentStep === 4 && (
            <StepQuestionsMedia
              mainProblem={mainProblem}
              uploadedPhotos={uploadedPhotos}
              onProblemChange={setMainProblem}
              onPhotosChange={setUploadedPhotos}
            />
          )}
        </div>

        {/* Wizard Controls */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Fields without asterisk (*) can be safely skipped
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-mint-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-mint-600 to-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-mint-600/20 transition hover:from-mint-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                Analyze My Farm
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Account saving prompt */}
      <div className="mt-4 pt-3 text-center border-t border-slate-100">
        <p className="text-[11px] text-slate-500">
          Want to track recommendations across seasons?{' '}
          <a
            href="/auth/login"
            className="font-semibold text-mint-700 hover:text-mint-800 hover:underline"
          >
            Sign in or register
          </a>{' '}
          to save your farm profile.
        </p>
      </div>
    </div>
  );
}
