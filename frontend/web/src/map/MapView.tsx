import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface SensorPoint { id: string; lat: number; lng: number; pm25?: number; pm10?: number; co2?: number; predictions?: { h6?: number[]; h24?: number[] } }

const defaultCenter = [21.0278, 105.8342]; // fallback (Hanoi) - replace with dynamic

export const MapView: React.FC<{ sensors: SensorPoint[] }> = ({ sensors }) => {
  useEffect(() => {
    // build heatmap points
    if (!sensors || sensors.length === 0) return;
    try {
      const heatPoints = sensors.map(s => [s.lat, s.lng, s.pm25 || 0]);
      // @ts-ignore
      const heatLayer = (L as any).heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 });
      // attach to default map container if available
      const mapEl = document.querySelector('.aq-map') as any;
      if (mapEl && mapEl._leaflet_map && heatLayer.addTo) {
        // remove old if exists
        if ((mapEl._leaflet_map as any)._heatLayer) {
          try { (mapEl._leaflet_map as any)._heatLayer.remove(); } catch (e) {}
        }
        (mapEl._leaflet_map as any)._heatLayer = heatLayer.addTo(mapEl._leaflet_map);
      }
    } catch (err) {
      console.warn('heatmap init failed', err);
    }
  }, [sensors]);

  return (
    <div className="w-full h-[70vh] rounded-2xl overflow-hidden glass-card">
      <MapContainer className="aq-map h-full" center={defaultCenter as any} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sensors.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng] as any}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Device {s.id}</div>
                <div>PM2.5: {s.pm25 ?? 'N/A'}</div>
                <div>PM10: {s.pm10 ?? 'N/A'}</div>
                <div>CO2: {s.co2 ?? 'N/A'}</div>
                {s.predictions?.h6 && <div>AI 6h: {s.predictions.h6[0]?.toFixed(1)}</div>}
                {s.predictions?.h24 && <div>AI 24h: {s.predictions.h24[0]?.toFixed(1)}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default MapView;
