import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../src/app/page';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Complete Farmer Journey End-to-End', () => {
  it('navigates through farm wizard and initiates analysis to /analyze', async () => {
    render(<HomePage />);

    // Step 1: Location & Field
    expect(screen.getByText(/Step 1 of 4|1-ci Addım/i)).toBeInTheDocument();
    const regionInput = screen.getByLabelText(/Agricultural Region|Regionu/i);
    fireEvent.change(regionInput, { target: { value: 'Shirvan-Salyan' } });

    const districtInput = screen.getByLabelText(/District \/ Municipality|Rayon/i);
    fireEvent.change(districtInput, { target: { value: 'Salyan' } });

    const nextBtn1 = screen.getByRole('button', { name: /Next|Növbəti/i });
    fireEvent.click(nextBtn1);

    // Step 2: Crop & Phenology
    expect(screen.getByText(/Step 2 of 4|2-ci Addım/i)).toBeInTheDocument();
    const cropSelect = screen.getByLabelText(/Current Crop|Bitki/i);
    fireEvent.change(cropSelect, { target: { value: 'Pomegranate' } });

    const nextBtn2 = screen.getByRole('button', { name: /Next|Növbəti/i });
    fireEvent.click(nextBtn2);

    // Step 3: Soil & Irrigation (skipping optional fields)
    expect(screen.getByText(/Step 3 of 4|3-cü Addım/i)).toBeInTheDocument();
    const nextBtn3 = screen.getByRole('button', { name: /Next|Növbəti/i });
    fireEvent.click(nextBtn3);

    // Step 4: Questions & Symptoms
    expect(screen.getByText(/Step 4 of 4|4-cü Addım/i)).toBeInTheDocument();
    const problemTextarea = screen.getByLabelText(
      /Main Agricultural Problem or Question|Əsas Aqrar Problem/i
    );
    fireEvent.change(problemTextarea, {
      target: { value: 'Need irrigation interval advice for flowering season' },
    });

    const submitBtn = screen.getByRole('button', { name: /Analyze My Farm|Təsərrüfatımı Təhlil Et/i });
    fireEvent.click(submitBtn);

    // Verify router navigation triggered to /analyze
    expect(mockPush).toHaveBeenCalledWith('/analyze');
  });
});
