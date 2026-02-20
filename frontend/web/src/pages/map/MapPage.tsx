// Map Page — Leaflet + Color-coded Sensor Markers + User Location
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Map, Navigation, Layers, Activity } from 'lucide-react';
import L from 'leaflet';
import { getAQIColor, getAQIDescription } from '@utils';

// Fix default Leaflet icon paths
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// Create colored custom marker
const createColoredIcon = (color: string) =>
    new L.DivIcon({
        className: '',
        html: `<div style="
      width: 20px; height: 20px; border-radius: 50% 50% 50% 0;
      background: ${color}; border: 2px solid rgba(255,255,255,0.8);
      transform: rotate(-45deg); box-shadow: 0 0 10px ${color}80;
    "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
    });

const userIcon = new L.DivIcon({
    className: '',
    html: `<div style="
    width: 16px; height: 16px; border-radius: 50%;
    background: #00d4ff; border: 3px solid white;
    box-shadow: 0 0 0 6px rgba(0,212,255,0.3), 0 0 20px rgba(0,212,255,0.5);
  "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// Mock sensor locations across a city
const mockSensors = [
    { id: 's1', name: 'City Center Station', lat: 28.6139, lng: 77.2090, aqi: 142, pm25: 68, co2: 510, status: 'online' as const },
    { id: 's2', name: 'Industrial Zone Alpha', lat: 28.6229, lng: 77.1950, aqi: 201, pm25: 115, co2: 720, status: 'online' as const },
    { id: 's3', name: 'Green Park Sensor', lat: 28.5535, lng: 77.2088, aqi: 62, pm25: 22, co2: 410, status: 'online' as const },
    { id: 's4', name: 'Highway Node 7', lat: 28.6309, lng: 77.2210, aqi: 178, pm25: 89, co2: 630, status: 'online' as const },
    { id: 's5', name: 'Airport Monitor', lat: 28.5562, lng: 77.1000, aqi: 95, pm25: 41, co2: 450, status: 'offline' as const },
    { id: 's6', name: 'Residential Block B', lat: 28.5981, lng: 77.2363, aqi: 118, pm25: 55, co2: 480, status: 'online' as const },
    { id: 's7', name: 'Hospital Area', lat: 28.6353, lng: 77.2167, aqi: 78, pm25: 29, co2: 425, status: 'online' as const },
];

// Legend component
const MapLegend: React.FC = () => (
    <div className="glass-card rounded-xl p-3 absolute bottom-6 left-4 z-[1000] text-xs space-y-1.5">
        <p className="font-semibold text-white mb-2">AQI Scale</p>
        {[
            { label: 'Good (0–50)', color: '#00e400' },
            { label: 'Moderate (51–100)', color: '#ffff00' },
            { label: 'Sensitive (101–150)', color: '#ff7e00' },
            { label: 'Unhealthy (151–200)', color: '#ff0000' },
            { label: 'Very Unhealthy (201+)', color: '#8f3f97' },
        ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-slate-300">{item.label}</span>
            </div>
        ))}
    </div>
);

export const MapPage: React.FC = () => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(true);
    const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                () => setUserLocation([28.6139, 77.2090]) // Default to Delhi
            );
        }
    }, []);

    const mapCenter: [number, number] = userLocation || [28.6139, 77.2090];

    return (
        <div className="p-4 lg:p-6 space-y-4 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold font-display text-white flex items-center gap-3"
                    >
                        <Map className="w-6 h-6 text-emerald-400" />
                        Pollution Map
                    </motion.h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time geospatial air quality visualization</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all
              ${showHeatmap
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-white/5 text-slate-400 border-white/10'}`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        Heatmap
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Active Sensors', value: mockSensors.filter(s => s.status === 'online').length, color: 'text-emerald-400' },
                    { label: 'Avg City AQI', value: Math.round(mockSensors.reduce((a, s) => a + s.aqi, 0) / mockSensors.length), color: 'text-cyan-400' },
                    { label: 'Danger Zones', value: mockSensors.filter(s => s.aqi > 150).length, color: 'text-red-400' },
                    { label: 'offline', value: mockSensors.filter(s => s.status === 'offline').length, color: 'text-slate-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card rounded-xl p-3 text-center"
                    >
                        <p className={`text-xl font-bold font-display ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-slate-500 capitalize">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Map */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden border border-white/10 relative"
                style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}
            >
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© OpenStreetMap'
                    />

                    {/* Heatmap circles */}
                    {showHeatmap && mockSensors.map((sensor) => (
                        <Circle
                            key={`heat-${sensor.id}`}
                            center={[sensor.lat, sensor.lng]}
                            radius={800}
                            pathOptions={{
                                fillColor: getAQIColor(sensor.aqi),
                                fillOpacity: 0.18,
                                stroke: false,
                            }}
                        />
                    ))}

                    {/* Sensor markers */}
                    {mockSensors.map((sensor) => (
                        <Marker
                            key={sensor.id}
                            position={[sensor.lat, sensor.lng]}
                            icon={createColoredIcon(sensor.status === 'offline' ? '#6b7280' : getAQIColor(sensor.aqi))}
                            eventHandlers={{ click: () => setSelectedSensor(sensor.id) }}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-sm">{sensor.name}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                      ${sensor.status === 'online' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-gray-500/20 text-gray-600'}`}>
                                            {sensor.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">AQI</span>
                                            <span className="font-bold" style={{ color: getAQIColor(sensor.aqi) }}>
                                                {sensor.aqi} — {getAQIDescription(sensor.aqi).status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">PM2.5</span>
                                            <span className="font-semibold">{sensor.pm25} μg/m³</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">CO₂</span>
                                            <span className="font-semibold">{sensor.co2} ppm</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* User location */}
                    {userLocation && (
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup>
                                <div className="text-sm">
                                    <p className="font-bold text-blue-600">📍 Your Location</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Legend overlay */}
                <MapLegend />

                {/* User location button */}
                {userLocation && (
                    <button
                        className="absolute top-4 right-4 z-[1000] glass-card p-2 rounded-xl border border-white/10
              text-cyan-400 hover:text-white transition-all"
                        title="My Location"
                    >
                        <Navigation className="w-5 h-5" />
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default MapPage;
