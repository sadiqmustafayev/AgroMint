import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AnalyzePage from '../src/app/analyze/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Analyze Page Component', () => {
  beforeEach(() => {
    // Clear storage
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
    }
  });

  it('renders LoadingAnalysis initially and transitions to full ResultsDashboard', async () => {
    vi.useFakeTimers();

    render(<AnalyzePage />);

    // Initially in loading state
    expect(
      screen.getByText(/Synthesizing Field Observations & Scientific References/i)
    ).toBeInTheDocument();

    // Advance timers past loading duration
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Dashboard header and cards should now be rendered
    expect(screen.getByText(/Agronomic Intelligence Dossier/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Agronomic Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Fertilizer & Soil Amendment Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Uncertainties & Information Gaps/i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
