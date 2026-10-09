'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, ShieldCheck, ArrowLeft, Lock, Mail, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login and return to analysis or home
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
          Sign in to AgroMint AI
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Access your farm records, historical soil tests, and seasonal recommendations.
        </p>

        {/* Notice of draft preservation */}
        <div className="mt-4 rounded-xl border border-mint-200 bg-mint-50/70 p-3 text-xs text-mint-900 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-mint-600 shrink-0" />
          <span>Your current farm consultation draft is preserved across sessions.</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Method toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium mb-5">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 rounded-md py-1.5 transition ${
                authMethod === 'email'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email Address
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 rounded-md py-1.5 transition ${
                authMethod === 'phone'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mobile Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === 'email' ? (
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="phone-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <input
                    id="phone-input"
                    type="tel"
                    required
                    placeholder="+994 (50) 000-00-00"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-mint-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
              >
                Sign In to Account
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
              href="/auth/register"
              className="font-medium text-mint-700 hover:text-mint-800 hover:underline"
            >
              Don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
