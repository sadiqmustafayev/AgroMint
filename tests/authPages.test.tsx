import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../src/app/auth/login/page';
import RegisterPage from '../src/app/auth/register/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Farmer Authentication Views', () => {
  it('renders LoginPage with consultation preservation notice and sign-in button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Sign in to AgroMint AI/i })).toBeInTheDocument();
    expect(screen.getByText(/Your current farm consultation draft is preserved/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Account/i })).toBeInTheDocument();
  });

  it('renders RegisterPage with farm profile registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /Create Farmer Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });
});
