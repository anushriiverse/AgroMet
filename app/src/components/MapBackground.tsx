import React, { useEffect, useRef } from 'react';
import { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapBackgroundProps {
  center: { lat: number; lon: number };
  onPick: (lat: number, lon: number) => void;
}

export const MapBackground: React.FC<MapBackgroundProps> = ({ center, onPick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-raster': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-raster-layer',
            type: 'raster',
            source: 'osm-raster',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [center.lon, center.lat],
      zoom: 10,
    });

    const marker = new Marker({ color: '#2563eb' })
      .setLngLat([center.lon, center.lat])
      .addTo(map);

    markerRef.current = marker;

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      marker.setLngLat([lng, lat]);
      onPick(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync marker and camera when center updates
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLngLat([center.lon, center.lat]);
      mapRef.current.easeTo({ center: [center.lon, center.lat] });
    }
  }, [center.lat, center.lon]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }}
    />
  );
};
