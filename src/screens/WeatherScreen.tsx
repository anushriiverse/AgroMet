import React, { useState } from 'react';
import { AppLanguage, AppScreen, WeatherDay } from '../types';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { DEFAULT_WEATHER_DAYS } from '../data/mockData';
import { playSpeech } from '../utils/audio';

interface WeatherScreenProps {
  language: AppLanguage;
  onNavigate: (screen: AppScreen) => void;
  onToggleLanguage: () => void;
  onOpenProfile: () => void;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({
  language,
  onNavigate,
  onToggleLanguage,
  onOpenProfile,
}) => {
  const isMr = language === 'mr';
  const [selectedDayId, setSelectedDayId] = useState<string>('mon');

  const weatherDays: WeatherDay[] = DEFAULT_WEATHER_DAYS;
  const activeDay = weatherDays.find((d) => d.id === selectedDayId) || weatherDays[0];

  const handleAudioSummary = () => {
    if (isMr) {
      playSpeech(
        `${activeDay.dayNameMr}, ${activeDay.date}. ${activeDay.conditionMr}. कमाल तापमान ${activeDay.tempHigh} अंश, किमान ${activeDay.tempLow} अंश. पाऊस शक्यता ${activeDay.rainProb} टक्के.`,
        'mr'
      );
    } else {
      playSpeech(
        `${activeDay.dayNameEn}, ${activeDay.date}. ${activeDay.conditionEn}. High ${activeDay.tempHigh} degrees, low ${activeDay.tempLow} degrees Celsius. Rain probability ${activeDay.rainProb} percent.`,
        'en'
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-surface flex flex-col justify-between overflow-x-hidden text-on-surface">
      {/* Header */}
      <Header
        title={isMr ? 'हवामान अंदाज (७ दिवस)' : '7-Day Weather'}
        subtitle="Radhanagari, Kolhapur (MH)"
        badge="Live"
        language={language}
        onToggleLanguage={onToggleLanguage}
        onOpenProfile={onOpenProfile}
        onOpenNotifications={() => onNavigate('alerts')}
      />

      {/* Main Container */}
      <main className="flex-1 w-full pt-16 pb-24 px-5 space-y-4">
        {/* Title Bar with Audio Guide */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
              {isMr ? 'स्थानिक हवामान अंदाज' : 'Local Forecast'}
            </h1>
            <p className="text-xs text-on-surface-variant">
              {isMr ? 'राधानगरी तालुका • IMD उपग्रह संकलन' : 'Radhanagari Taluka • IMD High-Res Radar'}
            </p>
          </div>

          <button
            onClick={handleAudioSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">volume_up</span>
            <span>{isMr ? 'हवामान ऐका' : 'Audio Forecast'}</span>
          </button>
        </div>

        {/* 7-Day Interactive Horizontal Strip */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {isMr ? 'दिवस निवडा (Select Day)' : 'Select Day'}
            </span>
            <span className="text-[11px] text-secondary font-semibold">
              {isMr ? 'तपशील पाहण्यासाठी टॅप करा' : 'Tap to inspect day'}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 -mx-5 px-5 no-scrollbar scroll-smooth">
            {weatherDays.map((day) => {
              const isSelected = day.id === selectedDayId;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  className={`min-w-[86px] p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isSelected
                      ? 'bg-primary-container text-on-primary ring-2 ring-secondary shadow-md'
                      : 'bg-surface-container-lowest text-on-surface border border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <span
                    className={`text-[11px] uppercase font-bold ${
                      isSelected ? 'text-secondary-fixed' : 'text-on-surface-variant'
                    }`}
                  >
                    {isMr ? day.dayNameMr : day.dayNameEn}
                  </span>
                  <span className="text-2xl my-1.5">{day.icon}</span>
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-surface-bright' : 'text-primary'
                    }`}
                  >
                    {day.tempHigh}° / {day.tempLow}°
                  </span>
                  <span
                    className={`text-[10px] font-bold mt-1 px-1.5 py-0.2 rounded-full ${
                      day.rainProb > 60
                        ? isSelected
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : 'bg-error-container text-error'
                        : isSelected
                        ? 'bg-white/15 text-white'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {day.rainProb}%
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Day Feature Hero Card */}
        <section className="rounded-3xl p-5 bg-gradient-to-br from-primary-container to-primary text-on-primary shadow-lg border border-primary-fixed/30 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wide">
                {isMr ? activeDay.dayNameMr : activeDay.dayNameEn} • {activeDay.date}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-white flex items-baseline gap-2">
                <span>{activeDay.tempHigh}°C</span>
                <span className="text-base text-surface-bright/80 font-semibold">
                  / {activeDay.tempLow}°C Min
                </span>
              </h2>
              <p className="text-sm font-semibold text-secondary-fixed flex items-center gap-1.5 mt-1">
                <span className="text-lg">{activeDay.icon}</span>
                <span>{isMr ? activeDay.conditionMr : activeDay.conditionEn}</span>
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
              {activeDay.icon}
            </div>
          </div>

          {/* Meteorological Metrics 4-Box Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/15">
            {/* Rain Chance & Amount */}
            <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-tertiary-fixed-dim">
                <span className="material-symbols-outlined text-[20px]">rainy</span>
              </div>
              <div>
                <span className="text-[10px] text-surface-bright/80 uppercase font-bold block">
                  {isMr ? 'पाऊस शक्यता व प्रमाण' : 'Rain Prob & Volume'}
                </span>
                <span className="text-xs font-bold text-white">
                  {activeDay.rainProb}% • {activeDay.rainAmountMm} mm
                </span>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-secondary-fixed">
                <span className="material-symbols-outlined text-[20px]">humidity_percentage</span>
              </div>
              <div>
                <span className="text-[10px] text-surface-bright/80 uppercase font-bold block">
                  {isMr ? 'सापेक्ष आर्द्रता' : 'Relative Humidity'}
                </span>
                <span className="text-xs font-bold text-white">{activeDay.humidity}%</span>
              </div>
            </div>

            {/* Wind Speed & Direction */}
            <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-secondary-fixed">
                <span className="material-symbols-outlined text-[20px]">air</span>
              </div>
              <div>
                <span className="text-[10px] text-surface-bright/80 uppercase font-bold block">
                  {isMr ? 'वारा वेग व दिशा' : 'Wind Speed & Dir'}
                </span>
                <span className="text-xs font-bold text-white">
                  {activeDay.windSpeedKmH} km/h • {activeDay.windDirection}
                </span>
              </div>
            </div>

            {/* UV Index / Radiation */}
            <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-tertiary-fixed-dim">
                <span className="material-symbols-outlined text-[20px]">sunny</span>
              </div>
              <div>
                <span className="text-[10px] text-surface-bright/80 uppercase font-bold block">
                  {isMr ? 'अतिनील किरण (UV)' : 'UV Radiation Index'}
                </span>
                <span className="text-xs font-bold text-white">Index {activeDay.uvIndex}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hourly Trend for Active Day */}
        <section className="space-y-2 bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-primary">
              {isMr ? 'तासनिहाय हवामान अंदाज' : 'Hourly Weather Forecast'}
            </h3>
            <span className="text-[11px] text-on-surface-variant">
              {isMr ? activeDay.dayNameMr : activeDay.dayNameEn}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { time: '06:00', temp: '22°', icon: '🌅', rain: '10%' },
              { time: '10:00', temp: '26°', icon: '🌤️', rain: '20%' },
              { time: '14:00', temp: '28°', icon: activeDay.icon, rain: `${activeDay.rainProb}%` },
              { time: '18:00', temp: '24°', icon: '🌧️', rain: '50%' },
            ].map((h, i) => (
              <div
                key={i}
                className="bg-surface-container-low rounded-xl p-2.5 flex flex-col items-center text-center gap-1"
              >
                <span className="text-[10px] text-on-surface-variant font-bold">{h.time}</span>
                <span className="text-xl">{h.icon}</span>
                <span className="text-xs font-bold text-primary">{h.temp}</span>
                <span className="text-[10px] text-on-tertiary-container font-semibold">
                  {h.rain}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Agronomic Operations Directives for Selected Day */}
        <section className="space-y-2.5">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">
              agriculture
            </span>
            <span>{isMr ? 'शेती कामांचा कृषी सल्ला' : 'Farming Operation Guidance'}</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Irrigation Directive */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/50 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">water</span>
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  {isMr ? 'सिंचन सल्ला (Irrigation)' : 'Irrigation Advice'}
                </span>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  {isMr ? activeDay.irrigationAdviceMr : activeDay.irrigationAdviceEn}
                </p>
              </div>
            </div>

            {/* Spray Window Directive */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">pest_control</span>
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-tertiary-container">
                  {isMr ? 'फवारणी अनुकूलता (Spraying Window)' : 'Spraying Window'}
                </span>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  {isMr ? activeDay.sprayAdviceMr : activeDay.sprayAdviceEn}
                </p>
              </div>
            </div>

            {/* Fertilizer Directive */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">compost</span>
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {isMr ? 'खत व्यवस्थापन (Fertilizer)' : 'Fertilizer Management'}
                </span>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  {isMr ? activeDay.fertilizerAdviceMr : activeDay.fertilizerAdviceEn}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Severe Alert Link Banner if high rain */}
        {activeDay.rainProb >= 60 && (
          <section className="p-4 rounded-2xl bg-error-container/80 border border-error/30 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-error text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">thunderstorm</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-error">
                  {isMr ? 'मुसळधार पाऊस व रोग अनुकूल धोका' : 'Heavy Rain & Disease Risk Alert'}
                </h4>
                <p className="text-[11px] text-on-error-container truncate">
                  {isMr ? 'करपा व खोडकुज रोगाचा प्रादुर्भाव वाढू शकतो.' : 'High humidity & showers trigger blast risk.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('alerts')}
              className="px-3 py-1.5 rounded-xl bg-surface-container-lowest text-error text-xs font-bold shrink-0 shadow-xs hover:bg-surface-container active:scale-95"
            >
              {isMr ? 'इशारा पहा' : 'View Risk'}
            </button>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="weather" onNavigate={onNavigate} language={language} alertCount={3} />
    </div>
  );
};
