import React from 'react';
import { PredictResponse } from '../services/agromet';

interface MapGlassPanelProps {
  prediction: PredictResponse | null;
  loading: boolean;
  domainFallbackNote?: string | null;
  isMobile?: boolean;
}

export const MapGlassPanel: React.FC<MapGlassPanelProps> = ({
  prediction,
  loading,
  domainFallbackNote,
  isMobile = false,
}) => {
  const villageName = prediction?.name || prediction?.village_name || '–';
  const state = prediction?.state || '–';
  const tempStr = prediction?.temp_c != null ? `${prediction.temp_c.toFixed(1)}°C` : '–';
  const etoStr = prediction?.eto_mm_day != null ? `${prediction.eto_mm_day.toFixed(1)} mm/day` : '–';
  const rainStr = prediction?.rainfall_jjas_mm != null ? `${Math.round(prediction.rainfall_jjas_mm)} mm` : '–';
  const elevationStr = prediction?.elevation_m != null ? `${prediction.elevation_m.toFixed(0)} m` : '–';
  const isValidated = prediction?.inside_validated_band ?? false;

  return (
    <div
      className="pointer-events-auto select-none"
      style={{
        position: 'fixed',
        top: isMobile ? '72px' : '16px',
        right: '16px',
        width: isMobile ? '46vw' : '300px',
        maxWidth: isMobile ? '200px' : '300px',
        zIndex: 20,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        padding: isMobile ? '10px 12px' : '16px',
      }}
    >
      {/* Domain fallback note if triggered */}
      {domainFallbackNote && prediction?.in_domain === false && (
        <div className="mb-2 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] leading-tight font-medium">
          {domainFallbackNote}
        </div>
      )}

      {/* Location Header */}
      <div className="flex items-start justify-between gap-1.5 mb-1">
        <div className="min-w-0 flex-1">
          <h2 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-neutral-900 truncate leading-tight`}>
            {villageName}
          </h2>
          <p className="text-[11px] text-neutral-500 font-medium truncate">{state}</p>
        </div>
        {loading && (
          <span className="material-symbols-outlined text-[14px] text-neutral-400 animate-spin shrink-0">
            progress_activity
          </span>
        )}
      </div>

      {/* Temperature Display: 30px on mobile, 44px on desktop */}
      <div className={isMobile ? 'my-1.5' : 'my-2.5'}>
        <div
          style={{ fontSize: isMobile ? '30px' : '44px' }}
          className="font-extrabold text-neutral-900 leading-none tracking-tight"
        >
          {tempStr}
        </div>
        <div className="text-[10px] md:text-[11px] font-medium text-neutral-500 mt-1">
          seasonal mean (JJAS)
        </div>
      </div>

      {/* Metrics Row: ETo, Rainfall, Elevation (Desktop only - stays in PEEK sheet on mobile) */}
      {!isMobile && (
        <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-neutral-200/60 text-center">
          <div>
            <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              ETo
            </span>
            <span className="text-xs font-bold text-neutral-800 mt-0.5 block">
              {etoStr}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              Rainfall
            </span>
            <span className="text-xs font-bold text-neutral-800 mt-0.5 block">
              {rainStr}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              Elevation
            </span>
            <span className="text-xs font-bold text-neutral-800 mt-0.5 block">
              {elevationStr}
            </span>
          </div>
        </div>
      )}

      {/* Validation Band Badge Only */}
      <div className={`${isMobile ? 'mt-1.5' : 'mt-2.5'} flex items-center justify-between`}>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${
            isValidated
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isValidated ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          />
          <span className="truncate">
            {isMobile
              ? (isValidated ? 'Validated' : 'Extrapolated')
              : (isValidated ? 'Gauge-validated band' : 'Outside band — extrapolated')}
          </span>
        </span>

        {!isMobile && prediction?.distance_km != null && (
          <span className="text-[11px] text-neutral-400 font-mono">
            {prediction.distance_km.toFixed(1)} km
          </span>
        )}
      </div>
    </div>
  );
};
