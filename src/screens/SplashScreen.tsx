import React from 'react';
import { PARAM_LOGO_URL } from '../data/mockData';
import { AppLanguage } from '../types';

interface SplashScreenProps {
  onStart: () => void;
  language: AppLanguage;
  onToggleLanguage: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  language,
  onToggleLanguage,
}) => {
  return (
    <div className="relative w-full min-h-screen bg-[#001708] flex flex-col justify-between overflow-hidden text-white select-none">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          alt="Lush agricultural landscape"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90"
          src="https://lh3.googleusercontent.com/aida/AEtjO1U7sn6fM9zpqd_x_La1EntfGg_ZHR0OjLLKBC4fAOmvCJNXHgIJk4a0x50K1-Vy9XZaBIunP4I_ZH0uOnHnVCnyTrWMWaIG-tR1C7HFtVrqzoZPGc816WMp2DNDFLcwqLBCJvnrQdrTQHGMrRCiuv2hw5Clc2YYm-NMdsNB8c1IfM9NSXNHZBSX35-3UIu0UVMg2z_vf1RFiyYAY3mVnh4GOOkerrVq9NivosnjAQKbxkeaErvOKHY_yvs"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#001c0a]/60 to-[#001407]/95"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full pt-safe px-5 pt-3 flex flex-col gap-3">
        {/* Top bar with logo and language toggle */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5">
              <img src={PARAM_LOGO_URL} alt="PARAM" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-xs font-bold tracking-wider uppercase">
              PARAM कृषी
            </span>
          </div>

          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 bg-black/40 hover:bg-black/55 active:scale-95 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-secondary-fixed">
              translate
            </span>
            <span>{language === 'mr' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Center Logo Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 my-auto">
        <div className="p-4 rounded-3xl bg-surface/95 backdrop-blur-xl border border-white/40 shadow-2xl flex items-center justify-center mb-6">
          <div className="w-28 h-28 flex items-center justify-center overflow-hidden rounded-2xl">
            <img src={PARAM_LOGO_URL} alt="PARAM Logo" className="w-full h-full object-contain p-1" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/90 text-on-secondary-fixed text-xs font-bold tracking-wider uppercase mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
          महाराष्ट्र कृषी सल्लागार • Agro Advisory
        </div>

        <h2 className="text-white/90 text-sm font-medium tracking-wide">
          {language === 'mr'
            ? 'अचूक हवामान अंदाज आणि पीक व्यवस्थापन'
            : 'Precision Farm Advisory & Weather'}
        </h2>
      </div>

      {/* Bottom Hero & Call to Action */}
      <section className="relative z-10 w-full px-6 pb-safe pb-10 flex flex-col">
        <h1 className="text-white font-extrabold text-[36px] leading-[42px] tracking-tight drop-shadow-md">
          {language === 'mr' ? (
            <>
              जाणून घ्या. नियोजन करा.
              <br />
              <span className="text-secondary-fixed font-headline-lg text-[36px] leading-[44px]">
                समृद्ध व्हा.
              </span>
            </>
          ) : (
            <>
              Know. Plan.
              <br />
              <span className="text-secondary-fixed font-headline-lg text-[36px] leading-[44px]">
                Grow.
              </span>
            </>
          )}
        </h1>

        <p className="text-white/85 text-sm leading-relaxed mt-3 font-normal max-w-[330px] drop-shadow-sm">
          {language === 'mr'
            ? 'आपल्या स्थानिक हवामानाची माहिती घ्या, शेती कामांचे अचूक नियोजन करा आणि पिकांचे संरक्षण करा.'
            : 'Know your local weather, plan your farm activities, and protect your crops.'}
        </p>

        <div className="mt-8 w-full flex items-center gap-4">
          <button
            onClick={onStart}
            className="relative overflow-hidden group flex-grow h-14 bg-gradient-to-r from-[#1b6d24] via-[#1f7c2a] to-[#163820] hover:from-[#217f2c] hover:to-[#1a4427] text-white rounded-2xl px-6 flex items-center justify-between border border-secondary-fixed/40 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-black/40"
          >
            <span className="font-headline-sm text-[16px] leading-tight font-bold text-white tracking-wide">
              {language === 'mr' ? 'सुरू करा / Get Started' : 'Get Started'}
            </span>
            <div className="w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <span className="material-symbols-outlined text-secondary-fixed text-xl">
                arrow_forward
              </span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
