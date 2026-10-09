import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FarmWizard } from '../src/components/farm-form/FarmWizard';

describe('FarmWizard Orchestrator', () => {
  it('allows navigation between steps and permits skipping optional fields', () => {
    render(<FarmWizard onSubmit={() => {}} />);
    expect(screen.getByText(/Step 1 of 4|1-ci Addım/i)).toBeInTheDocument();
    
    // Fill region (required in step 1)
    const regionInput = screen.getByLabelText(/Agricultural Region|Regionu/i);
    fireEvent.change(regionInput, { target: { value: 'Aran' } });

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /Next|Növbəti/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Step 2 of 4|2-ci Addım/i)).toBeInTheDocument();
  });

  it('submits form payload with entered data', () => {
    const handleSubmit = vi.fn();
    render(<FarmWizard onSubmit={handleSubmit} />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Agricultural Region|Regionu/i), { target: { value: 'Ganja-Dashkasan' } });
    fireEvent.click(screen.getByRole('button', { name: /Next|Növbəti/i }));

    // Step 2
    fireEvent.change(screen.getByLabelText(/Current Crop|Bitki/i), { target: { value: 'Wheat' } });
    fireEvent.click(screen.getByRole('button', { name: /Next|Növbəti/i }));

    // Step 3 (optional, skip to next)
    fireEvent.click(screen.getByRole('button', { name: /Next|Növbəti/i }));

    // Step 4
    fireEvent.change(screen.getByLabelText(/Main Agricultural Problem or Question|Əsas Aqrar Problem/i), {
      target: { value: 'Need spring fertilization advice' },
    });

    const submitBtn = screen.getByRole('button', { name: /Analyze My Farm|Təsərrüfatımı Təhlil Et/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'Ganja-Dashkasan',
        crop: 'Wheat',
        mainProblem: 'Need spring fertilization advice',
      })
    );
  });

  it('clears uploaded document names from submission payload when soil mode is switched to manual', () => {
    const handleSubmit = vi.fn();
    render(<FarmWizard onSubmit={handleSubmit} />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Agricultural Region|Regionu/i), { target: { value: 'Aran' } });
    fireEvent.click(screen.getByRole('button', { name: /Next|Növbəti/i }));

    // Step 2
    fireEvent.change(screen.getByLabelText(/Current Crop|Bitki/i), { target: { value: 'Wheat' } });
    fireEvent.click(screen.getByRole('button', { name: /Next|Növbəti/i }));

    // Step 3: In upload mode, upload a file
    const fileInput = screen.getByLabelText(/Upload Soil Lab Report|Torpaq Analizi/i);
    const testFile = new File(['dummy'], 'soil-sheet.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Then switch to manual data entry mode
    const manualBtn = screen.getByRole('button', { name: /Manual Data Entry|Əl ilə Məlumat/i });
    fireEvent.click(manualBtn);

    fireEvent.click(screen.getByRole('button', { name: /Next|Növbəti/i }));

    // Step 4
    fireEvent.change(screen.getByLabelText(/Main Agricultural Problem or Question|Əsas Aqrar Problem/i), {
      target: { value: 'Soil test query' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Analyze My Farm|Təsərrüfatımı Təhlil Et/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        soilMode: 'manual',
        uploadedDocumentNames: [],
      })
    );
  });
});
