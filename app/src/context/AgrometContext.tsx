import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { predict, modelInfo as fetchModelInfo, PredictResponse, ModelInfoResponse } from '../services/agromet';

interface AgrometContextValue {
  prediction: PredictResponse | null;
  modelInfo: ModelInfoResponse | null;
  loading: boolean;
  error: string | null;
  currentCoords: { lat: number; lon: number };
  isOutOfDomain: boolean;
  domainFallbackNote: string | null;
  setLocation: (lat: number, lon: number) => Promise<void>;
}

const DEFAULT_COORDS = { lat: 16.700, lon: 74.233 }; // Kolhapur
const DOMAIN = { latMin: 12.948, latMax: 17.550, lonMin: 73.448, lonMax: 76.552 };

const AgrometContext = createContext<AgrometContextValue | undefined>(undefined);

export const AgrometProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [modelInfoData, setModelInfoData] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState(DEFAULT_COORDS);
  const [isOutOfDomain, setIsOutOfDomain] = useState<boolean>(false);
  const [domainFallbackNote, setDomainFallbackNote] = useState<string | null>(null);

  const fetchPredictionForLocation = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setCurrentCoords({ lat, lon });
    const pred = await predict(lat, lon);
    if (pred) {
      setPrediction(pred);
      // Clear domain banner on any successful in-domain location
      if (pred.in_domain) {
        setIsOutOfDomain(false);
        setDomainFallbackNote(null);
      } else {
        setIsOutOfDomain(true);
        setDomainFallbackNote('showing Kolhapur — your location is outside the model domain');
      }
    } else {
      setError('Failed to load prediction from AgroMet API');
    }
    setLoading(false);
  }, []);

  const setLocation = useCallback(async (lat: number, lon: number) => {
    await fetchPredictionForLocation(lat, lon);
  }, [fetchPredictionForLocation]);

  useEffect(() => {
    // 1. Fetch static model credentials once
    fetchModelInfo().then((info) => {
      if (info) setModelInfoData(info);
    });

    // 2. Call navigator.geolocation.getCurrentPosition before falling back
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const inside =
            lat >= DOMAIN.latMin &&
            lat <= DOMAIN.latMax &&
            lon >= DOMAIN.lonMin &&
            lon <= DOMAIN.lonMax;

          if (inside) {
            setIsOutOfDomain(false);
            setDomainFallbackNote(null);
            fetchPredictionForLocation(lat, lon);
          } else {
            console.log('GPS coords actually fell outside model domain:', lat, lon);
            // Only set when GPS fix actually fell outside 12.948–17.550°N / 73.448–76.552°E
            setIsOutOfDomain(true);
            setDomainFallbackNote('showing Kolhapur — your location is outside the model domain');
            fetchPredictionForLocation(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
          }
        },
        (err) => {
          console.warn('GPS error / denied:', err.message);
          // If denied or timed out, default to Kolhapur WITHOUT the "outside model domain" banner
          setIsOutOfDomain(false);
          setDomainFallbackNote(null);
          fetchPredictionForLocation(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
        },
        { timeout: 3000 }
      );
    } else {
      setIsOutOfDomain(false);
      setDomainFallbackNote(null);
      fetchPredictionForLocation(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
    }
  }, [fetchPredictionForLocation]);

  return (
    <AgrometContext.Provider
      value={{
        prediction,
        modelInfo: modelInfoData,
        loading,
        error,
        currentCoords,
        isOutOfDomain,
        domainFallbackNote,
        setLocation,
      }}
    >
      {children}
    </AgrometContext.Provider>
  );
};

export function useAgromet(): AgrometContextValue {
  const context = useContext(AgrometContext);
  if (!context) {
    throw new Error('useAgromet must be used within an AgrometProvider');
  }
  return context;
}
