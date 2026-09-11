import React from 'react';
import { PredictResponse } from '../services/agromet';

interface MapGlassPanelProps {
  prediction: PredictResponse | null;
  loading: boolean;
  domainFallbackNote?: string | null;
}

export const MapGlassPanel: React.FC<MapGlassPanelProps> = ({
  prediction,
  loading,
  domainFallbackNote,
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
        top: '16px',
        right: '16px',
        width: '300px',
        zIndex: 20,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        padding: '16px',
      }}
    >
      {/* Domain fallback note if triggered */}
      {domainFallbackNote && prediction?.in_domain === false && (
        <div className="mb-2.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-tight font-medium">
          {domainFallbackNote}
        </div>
      )}

      {/* Location Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-neutral-900 truncate leading-tight">
            {villageName}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">{state}</p>
        </div>
        {loading && (
          <span className="material-symbols-outlined text-[16px] text-neutral-400 animate-spin">
            progress_activity
          </span>
        )}
      </div>

      {/* Temperature Display at 44px */}
      <div className="my-2.5">
        <div style={{ fontSize: '44px' }} className="font-extrabold text-neutral-900 leading-none tracking-tight">
          {tempStr}
        </div>
        <div className="text-[11px] font-medium text-neutral-500 mt-1">
          seasonal mean (JJAS)
        </div>
      </div>

      {/* Metrics Row: ETo, Rainfall, Elevation */}
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

      {/* Validation Band Badge */}
      <div className="mt-2.5 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isValidated
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isValidated ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          />
          {isValidated ? 'Gauge-validated band' : 'Outside band — extrapolated'}
        </span>

        {prediction?.distance_km != null && (
          <span className="text-[11px] text-neutral-400 font-mono">
            {prediction.distance_km.toFixed(1)} km
          </span>
        )}
      </div>
    </div>
  );
};
