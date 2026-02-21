import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Upgraded Dashboard Page — Glassmorphism + AI Predictions + Animated Cards
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Droplets, Activity, Cpu, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { PollutantChart, EnvironmentalChart, CO2Chart, AQITrendChart } from '@components/charts/SensorCharts';
import { PredictionChart } from '@components/charts/PredictionChart';
import { useAppSelector } from '@hooks';
import { selectSensorData, selectUser } from '@store';
import { getAQIColor, getAQIDescription, formatNumber } from '@utils';
import { runLSTMPrediction, generateMockSensorData } from '@/ai/lstmModel';
// Animated counter hook
function useCountUp(target, duration = 1000) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress >= 1)
                clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return value;
}
// AQI Circular Gauge
const AQIGauge = ({ aqi, size = 120 }) => {
    const clampedAQI = Math.min(Math.max(aqi, 0), 500);
    const percentage = clampedAQI / 500;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference * (1 - percentage * 0.75);
    const color = getAQIColor(aqi);
    const { status } = getAQIDescription(aqi);
    const animatedAQI = useCountUp(aqi, 1200);
    return (_jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsxs("div", { className: "relative", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, viewBox: "0 0 100 100", className: "-rotate-[135deg]", children: [_jsx("circle", { cx: "50", cy: "50", r: "45", fill: "none", stroke: "rgba(255,255,255,0.05)", strokeWidth: "8", strokeLinecap: "round", strokeDasharray: `${circumference * 0.75} ${circumference * 0.25}`, strokeDashoffset: 0 }), _jsx("circle", { cx: "50", cy: "50", r: "45", fill: "none", stroke: color, strokeWidth: "8", strokeLinecap: "round", strokeDasharray: `${circumference * 0.75} ${circumference * 0.25}`, strokeDashoffset: strokeDashoffset, style: { transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 6px ${color}80)` } })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: "text-2xl font-bold text-white font-display", children: animatedAQI }), _jsx("span", { className: "text-xs text-slate-400", children: "AQI" })] })] }), _jsx("span", { className: "text-xs font-semibold mt-1", style: { color }, children: status })] }));
};
// Stat Card
const StatCard = ({ label, icon, value, unit, gradient, border, trend, trendUp, delay = 0 }) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay }, className: "stat-card", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/5", children: icon }), trend && (_jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full border
          ${trendUp ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`, children: trend }))] }), _jsx("p", { className: "text-slate-400 text-xs font-medium uppercase tracking-wider mb-1", children: label }), _jsxs("div", { className: "flex items-end gap-1", children: [_jsx("span", { className: "text-2xl font-bold text-white font-display", children: value }), unit && _jsx("span", { className: "text-sm text-slate-400 mb-0.5", children: unit })] })] }));
export const DashboardPage = () => {
    const reduxSensorData = useAppSelector(selectSensorData);
    const user = useAppSelector(selectUser);
    const [sensorData, setSensorData] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [timeRange, setTimeRange] = useState('24h');
    const intervalRef = useRef();
    const loadData = () => {
        const data = reduxSensorData.length > 0 ? reduxSensorData : generateMockSensorData();
        setSensorData(data);
        const aqis = data.map((d) => d.aqi);
        const pm25s = data.map((d) => d.pm25);
        const co2s = data.map((d) => d.co2);
        setPrediction(runLSTMPrediction(aqis, pm25s, co2s));
        setLastRefresh(new Date());
    };
    useEffect(() => {
        loadData();
        intervalRef.current = setInterval(loadData, 5000);
        return () => clearInterval(intervalRef.current);
    }, [reduxSensorData]);
    if (!sensorData.length) {
        return (_jsx("div", { className: "p-6 space-y-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx("div", { className: "h-32 skeleton rounded-2xl" }, i))) }));
    }
    const latestData = sensorData[sensorData.length - 1];
    const avgAQI = Math.round(sensorData.reduce((s, d) => s + d.aqi, 0) / sensorData.length);
    const maxPM25 = Math.max(...sensorData.map((d) => d.pm25));
    return (_jsxs("div", { className: "p-4 lg:p-6 space-y-6 min-h-screen", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx(motion.h1, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "text-2xl lg:text-3xl font-bold font-display text-white", children: "Air Quality Dashboard" }), _jsxs(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, className: "text-slate-400 text-sm mt-1", children: ["Welcome back, ", _jsx("span", { className: "text-cyan-400 font-medium", children: user?.displayName || 'User' }), ' ', "\u00B7 Last updated ", lastRefresh.toLocaleTimeString()] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("select", { value: timeRange, onChange: (e) => setTimeRange(e.target.value), className: "text-xs bg-white/5 border border-white/10 text-slate-300 rounded-xl px-3 py-2\r\n              focus:outline-none focus:border-cyan-500/50 cursor-pointer", children: [_jsx("option", { value: "24h", children: "Last 24h" }), _jsx("option", { value: "7d", children: "Last 7 days" }), _jsx("option", { value: "30d", children: "Last 30 days" })] }), _jsx("button", { onClick: loadData, className: "p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all", children: _jsx(RefreshCw, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, className: "lg:col-span-1 glass-card rounded-2xl p-6 flex flex-col items-center justify-center", children: [_jsx("p", { className: "text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3", children: "Current AQI" }), _jsx(AQIGauge, { aqi: avgAQI, size: 130 }), _jsxs("p", { className: "text-xs text-slate-500 mt-3 text-center", children: [getAQIDescription(avgAQI).description.slice(0, 60), "..."] })] }), _jsxs("div", { className: "lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "PM2.5", value: formatNumber(latestData.pm25), unit: "\u03BCg/m\u00B3", icon: _jsx(Wind, { className: "w-5 h-5 text-cyan-400" }), gradient: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(14,165,233,0.1))", border: "#00d4ff", trend: `Max: ${formatNumber(maxPM25)}`, trendUp: latestData.pm25 > 50, delay: 0.1 }), _jsx(StatCard, { label: "PM10", value: formatNumber(latestData.pm10), unit: "\u03BCg/m\u00B3", icon: _jsx(Activity, { className: "w-5 h-5 text-violet-400" }), gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.1))", border: "#8b5cf6", delay: 0.15 }), _jsx(StatCard, { label: "CO\u2082", value: formatNumber(latestData.co2), unit: "ppm", icon: _jsx(Cpu, { className: "w-5 h-5 text-orange-400" }), gradient: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))", border: "#f97316", trend: latestData.co2 > 800 ? '⚠ High' : 'Normal', trendUp: latestData.co2 > 800, delay: 0.2 }), _jsx(StatCard, { label: "Temperature", value: formatNumber(latestData.temperature), unit: "\u00B0C", icon: _jsx(Thermometer, { className: "w-5 h-5 text-emerald-400" }), gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))", border: "#10b981", delay: 0.25 }), _jsx(StatCard, { label: "Humidity", value: formatNumber(latestData.humidity), unit: "%", icon: _jsx(Droplets, { className: "w-5 h-5 text-blue-400" }), gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))", border: "#3b82f6", delay: 0.3 }), _jsx(StatCard, { label: "NO\u2082", value: formatNumber(latestData.no2), unit: "\u03BCg/m\u00B3", icon: _jsx(AlertCircle, { className: "w-5 h-5 text-red-400" }), gradient: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.1))", border: "#ef4444", delay: 0.35 }), _jsx(StatCard, { label: "SO\u2082", value: formatNumber(latestData.so2), unit: "\u03BCg/m\u00B3", icon: _jsx(TrendingUp, { className: "w-5 h-5 text-pink-400" }), gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.1))", border: "#ec4899", delay: 0.4 }), _jsx(StatCard, { label: "Ozone (O\u2083)", value: formatNumber(latestData.o3), unit: "\u03BCg/m\u00B3", icon: _jsx(Wind, { className: "w-5 h-5 text-teal-400" }), gradient: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(13,148,136,0.1))", border: "#14b8a6", delay: 0.45 })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: _jsx(PollutantChart, { data: sensorData, height: 300 }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.35 }, children: _jsx(EnvironmentalChart, { data: sensorData, height: 300 }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: _jsx(CO2Chart, { data: sensorData, height: 270 }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.45 }, children: _jsx(AQITrendChart, { data: sensorData, height: 270 }) }), prediction && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, children: _jsx(PredictionChart, { prediction: prediction }) }))] })] }));
};
export default DashboardPage;
