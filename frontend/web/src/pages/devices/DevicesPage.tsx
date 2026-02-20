// Devices Page — Device Management with Admin Controls
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, WifiOff, RefreshCw, Plus, ReceiptText, Activity, Zap, Settings, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAQIColor, getAQIDescription } from '@utils';

interface Device {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
    status: 'online' | 'offline' | 'warning';
    health: number;
    aqi: number;
    pm25: number;
    co2: number;
    lastActive: Date;
    firmware: string;
    battery: number | null;
}

const mockDevices: Device[] = [
    { id: 'd1', name: 'City Center Station', location: 'Connaught Place, New Delhi', lat: 28.6139, lng: 77.2090, status: 'online', health: 94, aqi: 142, pm25: 68, co2: 510, lastActive: new Date(Date.now() - 30000), firmware: 'v2.4.1', battery: null },
    { id: 'd2', name: 'Industrial Zone Alpha', location: 'Okhla Industrial Area', lat: 28.6229, lng: 77.1950, status: 'warning', health: 61, aqi: 201, pm25: 115, co2: 720, lastActive: new Date(Date.now() - 5 * 60000), firmware: 'v2.3.0', battery: null },
    { id: 'd3', name: 'Green Park Sensor', location: 'Green Park, New Delhi', lat: 28.5535, lng: 77.2088, status: 'online', health: 98, aqi: 62, pm25: 22, co2: 410, lastActive: new Date(Date.now() - 10000), firmware: 'v2.4.1', battery: 87 },
    { id: 'd4', name: 'Highway Node 7', location: 'NH-8 Highway Bypass', lat: 28.6309, lng: 77.2210, status: 'online', health: 76, aqi: 178, pm25: 89, co2: 630, lastActive: new Date(Date.now() - 15000), firmware: 'v2.4.0', battery: null },
    { id: 'd5', name: 'Airport Monitor', location: 'Indira Gandhi International Airport', lat: 28.5562, lng: 77.1000, status: 'offline', health: 12, aqi: 0, pm25: 0, co2: 0, lastActive: new Date(Date.now() - 2 * 3600000), firmware: 'v2.2.0', battery: 15 },
    { id: 'd6', name: 'Residential Block B', location: 'Dwarka Sector 10', lat: 28.5981, lng: 77.2363, status: 'online', health: 88, aqi: 118, pm25: 55, co2: 480, lastActive: new Date(Date.now() - 45000), firmware: 'v2.4.1', battery: null },
    { id: 'd7', name: 'Hospital Area', location: 'AIIMS Complex', lat: 28.6353, lng: 77.2167, status: 'online', health: 99, aqi: 78, pm25: 29, co2: 425, lastActive: new Date(Date.now() - 8000), firmware: 'v2.4.1', battery: null },
];

const statusConfig = {
    online: { label: 'Online', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
    warning: { label: 'Warning', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
    offline: { label: 'Offline', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-500' },
};

const HealthBar: React.FC<{ health: number }> = ({ health }) => {
    const color = health >= 80 ? '#10b981' : health >= 50 ? '#f59e0b' : '#ef4444';
    return (
        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                style={{ width: `${health}%`, background: color, boxShadow: `0 0 6px ${color}80` }}
            />
        </div>
    );
};

export const DevicesPage: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>(mockDevices);
    const [simulating, setSimulating] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDeviceLocation, setNewDeviceLocation] = useState('');
    const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'warning'>('all');

    const simulate = (deviceId: string) => {
        setSimulating(deviceId);
        setTimeout(() => {
            setDevices((prev) => prev.map((d) => {
                if (d.id !== deviceId) return d;
                return {
                    ...d,
                    aqi: Math.round(Math.random() * 200 + 30),
                    pm25: parseFloat((Math.random() * 120 + 5).toFixed(1)),
                    co2: Math.round(Math.random() * 500 + 350),
                    lastActive: new Date(),
                };
            }));
            setSimulating(null);
            toast.success('Sensor data simulated!');
        }, 2000);
    };

    const filtered = devices.filter((d) => filter === 'all' || d.status === filter);

    const formatLastActive = (date: Date) => {
        const diff = Date.now() - date.getTime();
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
        return `${Math.round(diff / 3600000)}h ago`;
    };

    return (
        <div className="p-4 lg:p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold font-display text-white flex items-center gap-3"
                    >
                        <Cpu className="w-6 h-6 text-violet-400" />
                        Device Management
                    </motion.h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor and control all IoT sensor nodes</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Device
                </button>
            </div>

            {/* Add device form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-5 border border-cyan-500/20"
                >
                    <h3 className="text-white font-semibold mb-4 text-sm">Register New Device</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <input value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)}
                            placeholder="Device Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
                        <input value={newDeviceLocation} onChange={(e) => setNewDeviceLocation(e.target.value)}
                            placeholder="Location" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (newDeviceName && newDeviceLocation) {
                                    toast.success(`Device "${newDeviceName}" registered!`);
                                    setShowAddForm(false);
                                    setNewDeviceName('');
                                    setNewDeviceLocation('');
                                } else {
                                    toast.error('Please fill in all fields');
                                }
                            }}
                            className="btn-primary text-sm"
                        >
                            Register
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="btn-neon text-sm">Cancel</button>
                    </div>
                </motion.div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total', count: devices.length, color: 'text-slate-200' },
                    { label: 'Online', count: devices.filter(d => d.status === 'online').length, color: 'text-emerald-400' },
                    { label: 'Warning', count: devices.filter(d => d.status === 'warning').length, color: 'text-yellow-400' },
                    { label: 'Offline', count: devices.filter(d => d.status === 'offline').length, color: 'text-red-400' },
                ].map((stat, i) => (
                    <motion.button
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => setFilter(stat.label.toLowerCase() as any)}
                        className={`glass-card rounded-xl p-3 text-center hover:border-white/15 transition-all border
              ${filter === stat.label.toLowerCase() ? 'border-white/20' : 'border-white/5'}`}
                    >
                        <p className={`text-2xl font-bold font-display ${stat.color}`}>{stat.count}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                    </motion.button>
                ))}
            </div>

            {/* Device Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((device, index) => {
                    const status = statusConfig[device.status];
                    const isOffline = device.status === 'offline';
                    const aqi = device.aqi;

                    return (
                        <motion.div
                            key={device.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.07 }}
                            className={`glass-card rounded-2xl p-5 border transition-all hover:border-white/15
                ${device.status === 'offline' ? 'border-white/5 opacity-70' : 'border-white/8'}`}
                        >
                            {/* Device header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${status.bg} ${status.border}`}>
                                        {isOffline ? <WifiOff className="w-5 h-5 text-slate-400" /> : <Wifi className={`w-5 h-5 ${status.color}`} />}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">{device.name}</h3>
                                        <p className="text-slate-500 text-xs">{device.location}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${!isOffline ? 'animate-pulse' : ''}`}></div>
                                    {status.label}
                                </div>
                            </div>

                            {/* Data row */}
                            {!isOffline && (
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">AQI</p>
                                        <p className="text-lg font-bold font-display" style={{ color: getAQIColor(aqi) }}>{aqi}</p>
                                        <p className="text-xs" style={{ color: getAQIColor(aqi) }}>{getAQIDescription(aqi).status}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">PM2.5</p>
                                        <p className="text-lg font-bold text-white font-display">{device.pm25}</p>
                                        <p className="text-xs text-slate-500">μg/m³</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">CO₂</p>
                                        <p className="text-lg font-bold text-white font-display">{device.co2}</p>
                                        <p className="text-xs text-slate-500">ppm</p>
                                    </div>
                                </div>
                            )}

                            {/* Health + info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Health Score</span>
                                    <span className={device.health >= 80 ? 'text-emerald-400' : device.health >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                                        {device.health}%
                                    </span>
                                </div>
                                <HealthBar health={device.health} />

                                {device.battery !== null && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Battery</span>
                                        <span className={device.battery > 30 ? 'text-emerald-400' : 'text-red-400'}>{device.battery}%</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Last update: {formatLastActive(device.lastActive)}</span>
                                    <span>FW: {device.firmware}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                <button
                                    onClick={() => simulate(device.id)}
                                    disabled={simulating === device.id || isOffline}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                    bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {simulating === device.id
                                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        : <Play className="w-3.5 h-3.5" />}
                                    {simulating === device.id ? 'Simulating...' : 'Simulate Data'}
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                  bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all">
                                    <Settings className="w-3.5 h-3.5" /> Configure
                                </button>
                                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                                    <ReceiptText className="w-3.5 h-3.5" />
                                    <span>{device.id}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DevicesPage;
