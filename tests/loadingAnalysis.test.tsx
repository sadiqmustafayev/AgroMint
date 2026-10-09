import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LoadingAnalysis } from '../src/components/analysis/LoadingAnalysis';

describe('LoadingAnalysis Component', () => {
  it('shows progressive agronomic evaluation stages and triggers onComplete', () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();

    render(<LoadingAnalysis onComplete={handleComplete} durationMs={1000} />);

    expect(
      screen.getByText(/Synthesizing Field Observations & Scientific References/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Normalizing Soil Chemistry/i)).toBeInTheDocument();

    // Fast-forward timers
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(handleComplete).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
