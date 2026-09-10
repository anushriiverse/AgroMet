import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { predict, modelInfo as fetchModelInfo, PredictResponse, ModelInfoResponse } from '../services/agromet';

interface AgrometContextValue {
  prediction: PredictResponse | null;
  modelInfo: ModelInfoResponse | null;
  loading: boolean;
  error: string | null;
  currentCoords: { lat: number; lon: number };
  isOutOfDomain: boolean;
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

  const fetchPredictionForLocation = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setCurrentCoords({ lat, lon });
    const pred = await predict(lat, lon);
    if (pred) {
      setPrediction(pred);
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

    // 2. Geolocation on mount
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
            fetchPredictionForLocation(lat, lon);
          } else {
            setIsOutOfDomain(true);
            fetchPredictionForLocation(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
          }
        },
        () => {
          setIsOutOfDomain(false);
          fetchPredictionForLocation(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
        },
        { timeout: 5000 }
      );
    } else {
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
