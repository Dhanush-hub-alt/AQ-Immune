import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
const defaultCenter = [21.0278, 105.8342]; // fallback (Hanoi) - replace with dynamic
export const MapView = ({ sensors }) => {
    useEffect(() => {
        // build heatmap points
        if (!sensors || sensors.length === 0)
            return;
        try {
            const heatPoints = sensors.map(s => [s.lat, s.lng, s.pm25 || 0]);
            // @ts-ignore
            const heatLayer = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 });
            // attach to default map container if available
            const mapEl = document.querySelector('.aq-map');
            if (mapEl && mapEl._leaflet_map && heatLayer.addTo) {
                // remove old if exists
                if (mapEl._leaflet_map._heatLayer) {
                    try {
                        mapEl._leaflet_map._heatLayer.remove();
                    }
                    catch (e) { }
                }
                mapEl._leaflet_map._heatLayer = heatLayer.addTo(mapEl._leaflet_map);
            }
        }
        catch (err) {
            console.warn('heatmap init failed', err);
        }
    }, [sensors]);
    return (_jsx("div", { className: "w-full h-[70vh] rounded-2xl overflow-hidden glass-card", children: _jsxs(MapContainer, { className: "aq-map h-full", center: defaultCenter, zoom: 12, scrollWheelZoom: true, children: [_jsx(TileLayer, { attribution: '\u00A9 OpenStreetMap contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), sensors.map(s => (_jsx(Marker, { position: [s.lat, s.lng], children: _jsx(Popup, { children: _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-semibold", children: ["Device ", s.id] }), _jsxs("div", { children: ["PM2.5: ", s.pm25 ?? 'N/A'] }), _jsxs("div", { children: ["PM10: ", s.pm10 ?? 'N/A'] }), _jsxs("div", { children: ["CO2: ", s.co2 ?? 'N/A'] }), s.predictions?.h6 && _jsxs("div", { children: ["AI 6h: ", s.predictions.h6[0]?.toFixed(1)] }), s.predictions?.h24 && _jsxs("div", { children: ["AI 24h: ", s.predictions.h24[0]?.toFixed(1)] })] }) }) }, s.id)))] }) }));
};
export default MapView;
