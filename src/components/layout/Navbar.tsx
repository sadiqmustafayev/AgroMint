"use client";

import React from "react";
import { ShieldCheck, User } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import Image from "next/image";
import Logo from "../../../public/AgroMint_logo2.png";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <a href="/" className="group flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
            <Image
              src={Logo}
              alt="AgroMint AI"
              width={64}
              height={64}
              priority
              className="h-20 w-20 object-contain"
            />
          </div>

          <div>
            <span className="block -mt-0.5 text-[11px] font-medium text-slate-500">
              {t("common.platformSubtitle")}
            </span>
          </div>
        </a>

        {/* Navigation links & Guest status */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
            <a
              href="#farm-intake-section"
              className="hover:text-mint-700 transition"
            >
              {t("wizard.title")}
            </a>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-600" />
              {t("common.verifiedGuides")}
            </span>
          </div>

          {/* Language Switcher Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("az")}
              className={`rounded-md px-2 py-1 transition ${
                language === "az"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Azərbaycan dili"
            >
              AZ
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-2 py-1 transition ${
                language === "en"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t("common.signIn")}</span>
            </a>
            <a
              href="/auth/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-mint-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-mint-700"
            >
              <span className="hidden sm:inline">{t("common.register")}</span>
              <span className="sm:hidden">+</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
