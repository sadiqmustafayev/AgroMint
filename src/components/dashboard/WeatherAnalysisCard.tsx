import React from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Wind,
  Droplets,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Waves,
} from 'lucide-react';
import { SevenDayWeatherData, DailyWeatherForecast } from '../../lib/weatherService';
import { WeatherSynthesis } from '../../types/advisory';
import { useLanguage } from '../../i18n/LanguageContext';

interface WeatherAnalysisCardProps {
  weatherData?: SevenDayWeatherData;
  weatherSynthesis?: WeatherSynthesis;
  className?: string;
}

export function WeatherAnalysisCard({
  weatherData,
  weatherSynthesis,
  className = '',
}: WeatherAnalysisCardProps) {
  const { language } = useLanguage();
  const isAz = language === 'az';

  if (!weatherData && !weatherSynthesis) {
    return null;
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-6 w-6 text-amber-500" />;
    if (code >= 1 && code <= 3) return <CloudSun className="h-6 w-6 text-emerald-500" />;
    if (code >= 51 && code <= 65) return <CloudRain className="h-6 w-6 text-sky-500" />;
    if (code >= 80 && code <= 82) return <CloudRain className="h-6 w-6 text-blue-600" />;
    if (code >= 95) return <CloudLightning className="h-6 w-6 text-purple-500" />;
    return <Cloud className="h-6 w-6 text-slate-400" />;
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Header with Title and Badges */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 shadow-inner">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {isAz
                  ? '7 Günlük Hava Proqnozu & AI Aqronomik Nəticələri'
                  : '7-Day Weather Forecast & AI Agronomic Conclusions'}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <Sparkles className="h-3 w-3" />
                {isAz ? 'Canlı İnteqrasiya' : 'Live Integrated'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {weatherData
                ? `${weatherData.locationName} • ${isAz ? 'Koordinatlar' : 'Coordinates'}: ${weatherData.latitude.toFixed(2)}°N, ${weatherData.longitude.toFixed(2)}°E`
                : isAz ? 'Bölgə üzrə meteoroloji təhlil' : 'Regional meteorological synthesis'}
            </p>
          </div>
        </div>

        {weatherData?.summary && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg bg-sky-50 px-2.5 py-1 font-medium text-sky-800 border border-sky-100/80">
              💧 {isAz ? 'Ümumi yağıntı:' : 'Total rain:'}{' '}
              <strong className="font-bold">{weatherData.summary.totalRainfallMm} mm</strong>
            </span>
            <span className="rounded-lg bg-amber-50 px-2.5 py-1 font-medium text-amber-800 border border-amber-100/80">
              🌡️ {isAz ? 'Orta temp:' : 'Avg high:'}{' '}
              <strong className="font-bold">{weatherData.summary.avgMaxTemp}°C</strong>
            </span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 border border-slate-200">
              💨 {isAz ? 'Maks. külək:' : 'Max wind:'}{' '}
              <strong className="font-bold">{weatherData.summary.maxWindSpeedKmH} km/h</strong>
            </span>
          </div>
        )}
      </div>

      {/* AI Meteorological Synthesis & Decision Support Banner */}
      {weatherSynthesis && (
        <div className="mt-5 rounded-xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {weatherSynthesis.headline}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {weatherSynthesis.summary}
              </p>
            </div>
          </div>

          {/* 3 Impact Analysis Pillar Boxes */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* 1. Irrigation Impact */}
            <div className="rounded-lg border border-sky-200 bg-white/90 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1">
                <Waves className="h-4 w-4 text-sky-600" />
                <span>{isAz ? 'Suvarmaya Təsiri' : 'Irrigation Impact'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weatherSynthesis.irrigationImpact}
              </p>
            </div>

            {/* 2. Fertilizer Timing Impact */}
            <div className="rounded-lg border border-amber-200 bg-white/90 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                <Droplets className="h-4 w-4 text-amber-600" />
                <span>{isAz ? 'Gübrələmə Təqvimi' : 'Fertilizer Timing'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weatherSynthesis.fertilizerImpact}
              </p>
            </div>

            {/* 3. Spray & Protection Window */}
            <div className="rounded-lg border border-emerald-200 bg-white/90 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                <Wind className="h-4 w-4 text-emerald-600" />
                <span>{isAz ? 'Çiləmə & Mühafizə Pəncərəsi' : 'Spray & Protection Window'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weatherSynthesis.sprayWindowRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast Grid Strip */}
      {weatherData?.daily && weatherData.daily.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isAz ? 'Gündəlik Meteoroloji Göstəricilər' : 'Daily Meteorological Breakdown'}
            </span>
            <span className="text-xs text-slate-400">
              {isAz ? 'Mənbə: Open-Meteo & AgroMint Engine' : 'Source: Open-Meteo & AgroMint Engine'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
            {weatherData.daily.slice(0, 7).map((day: DailyWeatherForecast, idx: number) => {
              const isRainy = day.precipitationSumMm >= 2 || day.precipitationProbabilityPct >= 50;
              const isWindy = day.windSpeedMaxKmH >= 18;

              return (
                <div
                  key={day.date || idx}
                  className={`flex flex-col items-center rounded-xl p-3 text-center transition-all border ${
                    isRainy
                      ? 'border-sky-300 bg-sky-50/50 shadow-xs'
                      : isWindy
                      ? 'border-amber-300 bg-amber-50/30 shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  {/* Day of Week & Date */}
                  <span className="text-xs font-bold text-slate-800">{day.dayOfWeek}</span>
                  <span className="text-[10px] text-slate-400 mb-2">
                    {day.date.split('-').slice(1).join('/')}
                  </span>

                  {/* Weather Icon */}
                  <div className="my-1">{getWeatherIcon(day.weatherCode)}</div>

                  {/* Condition label */}
                  <span className="text-[11px] font-medium text-slate-700 line-clamp-1 h-4">
                    {day.conditionDescription}
                  </span>

                  {/* Temperature Max / Min */}
                  <div className="mt-2 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-slate-900">{day.tempMax}°</span>
                    <span className="text-[11px] text-slate-400">/ {day.tempMin}°</span>
                  </div>

                  {/* Precipitation Sum & Prob */}
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-sky-700">
                    <Droplets className="h-3 w-3" />
                    <span>{day.precipitationSumMm} mm</span>
                  </div>

                  {/* Wind Speed */}
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                    <Wind className="h-3 w-3" />
                    <span className={isWindy ? 'font-bold text-amber-700' : ''}>
                      {day.windSpeedMaxKmH} km/h
                    </span>
                  </div>

                  {/* Warning Pill for Rain or High Wind */}
                  {isRainy && (
                    <span className="mt-2 inline-flex items-center rounded bg-sky-200/80 px-1.5 py-0.5 text-[9px] font-bold text-sky-900">
                      🌧️ {isAz ? 'Yağıntı' : 'Rain'}
                    </span>
                  )}
                  {!isRainy && isWindy && (
                    <span className="mt-2 inline-flex items-center rounded bg-amber-200/80 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">
                      💨 {isAz ? 'Küləkli' : 'Wind'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
