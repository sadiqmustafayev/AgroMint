import React from 'react';
import { HelpCircle, Camera } from 'lucide-react';
import { FileUploadZone } from '../shared/FileUploadZone';

const QUICK_PROMPTS = [
  'Yellowing lower leaves and stunted growth',
  'Interveinal chlorosis on young upper leaves',
  'Leaf curl and sticky honeydew spotting',
  'Recommended nitrogen top-dressing split dosage',
  'Irrigation scheduling during current heat wave',
  'Pre-flowering micronutrient and boron application',
];

interface StepQuestionsMediaProps {
  mainProblem: string;
  uploadedPhotos: string[];
  onProblemChange: (problem: string) => void;
  onPhotosChange: (photos: string[]) => void;
}

export function StepQuestionsMedia({
  mainProblem,
  uploadedPhotos,
  onProblemChange,
  onPhotosChange,
}: StepQuestionsMediaProps) {
  const appendPrompt = (promptText: string) => {
    if (!mainProblem) {
      onProblemChange(promptText);
    } else if (!mainProblem.includes(promptText)) {
      onProblemChange(`${mainProblem}. ${promptText}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Agricultural Inquiries & Visual Evidence
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Detail your agronomic question, observed symptoms, or management objectives.
        </p>
      </div>

      {/* Main Problem Textarea */}
      <div>
        <label
          htmlFor="main-problem-textarea"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          <HelpCircle className="w-3.5 h-3.5 text-mint-600" />
          Main Agricultural Problem or Question <span className="text-red-500">*</span>
        </label>
        <div className="mt-1.5">
          <textarea
            id="main-problem-textarea"
            rows={4}
            required
            placeholder="Describe what you are seeing in your field (e.g. leaf discoloration, pest activity, fertilizer dosage questions, or irrigation planning)..."
            value={mainProblem}
            onChange={(e) => onProblemChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          />
        </div>

        {/* Quick prompt suggestion pills */}
        <div className="mt-2.5">
          <span className="text-[11px] font-medium text-slate-500">
            Quick Symptom Suggestions:
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => appendPrompt(p)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 transition hover:border-mint-300 hover:bg-mint-50/60 hover:text-mint-800"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo & Document Uploads */}
      <div className="pt-2 border-t border-slate-200">
        <FileUploadZone
          label="Field Photographs & Leaf Lesion Photos"
          description="Attach clear photographs of affected leaves, roots, soil profiles, or entire field rows (Optional)"
          acceptedTypes={['jpg', 'jpeg', 'png', 'webp']}
          maxFiles={6}
          initialFiles={uploadedPhotos}
          onFilesSelected={onPhotosChange}
        />
      </div>
    </div>
  );
}
