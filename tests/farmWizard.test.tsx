import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FarmWizard } from '../src/components/farm-form/FarmWizard';

describe('FarmWizard Orchestrator', () => {
  it('allows navigation between steps and permits skipping optional fields', () => {
    render(<FarmWizard onSubmit={() => {}} />);
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    
    // Fill region (required in step 1)
    const regionInput = screen.getByLabelText(/Agricultural Region/i);
    fireEvent.change(regionInput, { target: { value: 'Aran' } });

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
  });

  it('submits form payload with entered data', () => {
    const handleSubmit = vi.fn();
    render(<FarmWizard onSubmit={handleSubmit} />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Agricultural Region/i), { target: { value: 'Ganja-Dashkasan' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2
    fireEvent.change(screen.getByLabelText(/Current Crop/i), { target: { value: 'Wheat' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 3 (optional, skip to next)
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 4
    fireEvent.change(screen.getByLabelText(/Main Agricultural Problem or Question/i), {
      target: { value: 'Need spring fertilization advice' },
    });

    const submitBtn = screen.getByRole('button', { name: /Analyze My Farm/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'Ganja-Dashkasan',
        crop: 'Wheat',
        mainProblem: 'Need spring fertilization advice',
      })
    );
  });
});
