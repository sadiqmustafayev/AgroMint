import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataBadge } from '../src/components/shared/DataBadge';
import { AgroSphereLink } from '../src/components/shared/AgroSphereLink';
import { MetricGauge } from '../src/components/shared/MetricGauge';

describe('Shared UI Components', () => {
  it('renders correct label for AI Assessment badge', () => {
    render(<DataBadge variant="ai-assessment" />);
    expect(screen.getByText('AI Assessment')).toBeInTheDocument();
  });

  it('renders correct label for Submitted Data badge', () => {
    render(<DataBadge variant="submitted" />);
    expect(screen.getByText('Submitted Data')).toBeInTheDocument();
  });

  it('renders correct label for Actionable Recommendation badge', () => {
    render(<DataBadge variant="recommendation" />);
    expect(screen.getByText('Actionable Recommendation')).toBeInTheDocument();
  });

  it('renders AgroSphere outbound link with security attributes and external indicator', () => {
    render(
      <AgroSphereLink
        title="Explore Fertilizers on AgroSphere"
        description="Connect with verified distributors"
        destinationUrl="https://agrosphere.org/marketplace/fertilizers"
        serviceType="fertilizer"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://agrosphere.org/marketplace/fertilizers');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText(/Explore Fertilizers on AgroSphere/i)).toBeInTheDocument();
  });

  it('renders MetricGauge with label, value, and status', () => {
    render(
      <MetricGauge
        label="Soil pH"
        value={6.8}
        unit="pH"
        status="optimal"
        benchmark="6.0 - 7.2"
      />
    );
    expect(screen.getByText('Soil pH')).toBeInTheDocument();
    expect(screen.getByText('6.8')).toBeInTheDocument();
    expect(screen.getByText(/Optimal/i)).toBeInTheDocument();
  });
});
