import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Devices Page — Device Management with Admin Controls
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, WifiOff, RefreshCw, Plus, ReceiptText, Activity, Zap, Settings, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAQIColor, getAQIDescription } from '@utils';
const mockDevices = [
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
const HealthBar = ({ health }) => {
    const color = health >= 80 ? '#10b981' : health >= 50 ? '#f59e0b' : '#ef4444';
    return (_jsx("div", { className: "relative h-1.5 bg-white/10 rounded-full overflow-hidden", children: _jsx("div", { className: "absolute left-0 top-0 h-full rounded-full transition-all duration-1000", style: { width: `${health}%`, background: color, boxShadow: `0 0 6px ${color}80` } }) }));
};
export const DevicesPage = () => {
    const [devices, setDevices] = useState(mockDevices);
    const [simulating, setSimulating] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDeviceLocation, setNewDeviceLocation] = useState('');
    const [filter, setFilter] = useState('all');
    const simulate = (deviceId) => {
        setSimulating(deviceId);
        setTimeout(() => {
            setDevices((prev) => prev.map((d) => {
                if (d.id !== deviceId)
                    return d;
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
    const formatLastActive = (date) => {
        const diff = Date.now() - date.getTime();
        if (diff < 60000)
            return 'Just now';
        if (diff < 3600000)
            return `${Math.round(diff / 60000)}m ago`;
        return `${Math.round(diff / 3600000)}h ago`;
    };
    return (_jsxs("div", { className: "p-4 lg:p-6 space-y-6 min-h-screen", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(motion.h1, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "text-2xl font-bold font-display text-white flex items-center gap-3", children: [_jsx(Cpu, { className: "w-6 h-6 text-violet-400" }), "Device Management"] }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Monitor and control all IoT sensor nodes" })] }), _jsxs("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn-primary flex items-center gap-2 text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Device"] })] }), showAddForm && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "glass-card rounded-2xl p-5 border border-cyan-500/20", children: [_jsx("h3", { className: "text-white font-semibold mb-4 text-sm", children: "Register New Device" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4", children: [_jsx("input", { value: newDeviceName, onChange: (e) => setNewDeviceName(e.target.value), placeholder: "Device Name", className: "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5\r\n                text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" }), _jsx("input", { value: newDeviceLocation, onChange: (e) => setNewDeviceLocation(e.target.value), placeholder: "Location", className: "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5\r\n                text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => {
                                    if (newDeviceName && newDeviceLocation) {
                                        toast.success(`Device "${newDeviceName}" registered!`);
                                        setShowAddForm(false);
                                        setNewDeviceName('');
                                        setNewDeviceLocation('');
                                    }
                                    else {
                                        toast.error('Please fill in all fields');
                                    }
                                }, className: "btn-primary text-sm", children: "Register" }), _jsx("button", { onClick: () => setShowAddForm(false), className: "btn-neon text-sm", children: "Cancel" })] })] })), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                    { label: 'Total', count: devices.length, color: 'text-slate-200' },
                    { label: 'Online', count: devices.filter(d => d.status === 'online').length, color: 'text-emerald-400' },
                    { label: 'Warning', count: devices.filter(d => d.status === 'warning').length, color: 'text-yellow-400' },
                    { label: 'Offline', count: devices.filter(d => d.status === 'offline').length, color: 'text-red-400' },
                ].map((stat, i) => (_jsxs(motion.button, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.07 }, onClick: () => setFilter(stat.label.toLowerCase()), className: `glass-card rounded-xl p-3 text-center hover:border-white/15 transition-all border
              ${filter === stat.label.toLowerCase() ? 'border-white/20' : 'border-white/5'}`, children: [_jsx("p", { className: `text-2xl font-bold font-display ${stat.color}`, children: stat.count }), _jsx("p", { className: "text-xs text-slate-500", children: stat.label })] }, stat.label))) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: filtered.map((device, index) => {
                    const status = statusConfig[device.status];
                    const isOffline = device.status === 'offline';
                    const aqi = device.aqi;
                    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.07 }, className: `glass-card rounded-2xl p-5 border transition-all hover:border-white/15
                ${device.status === 'offline' ? 'border-white/5 opacity-70' : 'border-white/8'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center border ${status.bg} ${status.border}`, children: isOffline ? _jsx(WifiOff, { className: "w-5 h-5 text-slate-400" }) : _jsx(Wifi, { className: `w-5 h-5 ${status.color}` }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-semibold text-sm", children: device.name }), _jsx("p", { className: "text-slate-500 text-xs", children: device.location })] })] }), _jsxs("div", { className: `flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`, children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${status.dot} ${!isOffline ? 'animate-pulse' : ''}` }), status.label] })] }), !isOffline && (_jsxs("div", { className: "grid grid-cols-3 gap-3 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-xs text-slate-500", children: "AQI" }), _jsx("p", { className: "text-lg font-bold font-display", style: { color: getAQIColor(aqi) }, children: aqi }), _jsx("p", { className: "text-xs", style: { color: getAQIColor(aqi) }, children: getAQIDescription(aqi).status })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-xs text-slate-500", children: "PM2.5" }), _jsx("p", { className: "text-lg font-bold text-white font-display", children: device.pm25 }), _jsx("p", { className: "text-xs text-slate-500", children: "\u03BCg/m\u00B3" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-xs text-slate-500", children: "CO\u2082" }), _jsx("p", { className: "text-lg font-bold text-white font-display", children: device.co2 }), _jsx("p", { className: "text-xs text-slate-500", children: "ppm" })] })] })), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [_jsx(Activity, { className: "w-3 h-3" }), " Health Score"] }), _jsxs("span", { className: device.health >= 80 ? 'text-emerald-400' : device.health >= 50 ? 'text-yellow-400' : 'text-red-400', children: [device.health, "%"] })] }), _jsx(HealthBar, { health: device.health }), device.battery !== null && (_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [_jsx(Zap, { className: "w-3 h-3" }), " Battery"] }), _jsxs("span", { className: device.battery > 30 ? 'text-emerald-400' : 'text-red-400', children: [device.battery, "%"] })] })), _jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [_jsxs("span", { children: ["Last update: ", formatLastActive(device.lastActive)] }), _jsxs("span", { children: ["FW: ", device.firmware] })] })] }), _jsxs("div", { className: "flex items-center gap-2 pt-3 border-t border-white/5", children: [_jsxs("button", { onClick: () => simulate(device.id), disabled: simulating === device.id || isOffline, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold\r\n                    bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all\r\n                    disabled:opacity-40 disabled:cursor-not-allowed", children: [simulating === device.id
                                                ? _jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" })
                                                : _jsx(Play, { className: "w-3.5 h-3.5" }), simulating === device.id ? 'Simulating...' : 'Simulate Data'] }), _jsxs("button", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold\r\n                  bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all", children: [_jsx(Settings, { className: "w-3.5 h-3.5" }), " Configure"] }), _jsxs("div", { className: "ml-auto flex items-center gap-1.5 text-xs text-slate-500", children: [_jsx(ReceiptText, { className: "w-3.5 h-3.5" }), _jsx("span", { children: device.id })] })] })] }, device.id));
                }) })] }));
};
export default DevicesPage;
