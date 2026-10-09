import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/app/page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Homepage View', () => {
  it('renders AgroMint AI branding, hero, and farm intake wizard', () => {
    render(<HomePage />);

    // Brand and platform title
    expect(screen.getAllByText(/AgroMint AI/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Agricultural Intelligence Platform/i).length
    ).toBeGreaterThan(0);

    // Hero section
    expect(
      screen.getByText(/Context-Aware Agronomic Intelligence for Modern Farms/i)
    ).toBeInTheDocument();

    // Wizard presence
    expect(screen.getByText(/Intelligent Farm Intake Wizard/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
  });
});
