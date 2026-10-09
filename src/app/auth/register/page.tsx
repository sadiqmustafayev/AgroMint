'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/analyze');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-600 text-white shadow-md shadow-mint-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            AgroMint AI
          </span>
        </a>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Create Farmer Account
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Register to save multiple farm plots, track soil trends, and receive seasonal alerts.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Full Name / Farm Name
              </label>
              <div className="mt-1">
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="e.g. John Doe / Green Valley Farm"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Email Address or Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="reg-email"
                  type="text"
                  required
                  placeholder="farmer@example.com or +994..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="reg-password"
                  type="password"
                  required
                  placeholder="Create a strong password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-mint-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              >
                Create Account & Save Farm Profile
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </a>
            <a
              href="/auth/login"
              className="font-medium text-mint-700 hover:text-mint-800 hover:underline"
            >
              Already registered? Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
