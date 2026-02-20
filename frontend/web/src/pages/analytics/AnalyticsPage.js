import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Analytics Page — Charts + Date Range Filter + CSV Download
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { generateMockSensorData, runLSTMPrediction } from '@/ai/lstmModel';
// Generate weekly data
const generateWeeklyData = () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    aqi: Math.round(Math.random() * 100 + 50),
    pm25: parseFloat((Math.random() * 60 + 15).toFixed(1)),
    pm10: parseFloat((Math.random() * 80 + 20).toFixed(1)),
    co2: Math.round(Math.random() * 300 + 400),
}));
// Generate monthly data (30 days)
const generateMonthlyData = () => Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const rush = [1, 3, 4].includes(date.getDay());
    return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        aqi: Math.round((rush ? 90 : 65) + Math.random() * 50),
        pm25: parseFloat(((rush ? 45 : 28) + Math.random() * 35).toFixed(1)),
        forecast: Math.round(Math.random() * 80 + 60),
    };
});
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "glass-card p-3 rounded-xl border border-white/10 text-xs space-y-1", children: [_jsx("p", { className: "text-slate-400 font-medium", children: label }), payload.map((p) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: { background: p.color } }), _jsxs("span", { className: "text-slate-300 capitalize", children: [p.dataKey, ":"] }), _jsx("span", { className: "text-white font-bold", children: p.value })] }, p.dataKey)))] }));
};
export const AnalyticsPage = () => {
    const [weeklyData] = useState(generateWeeklyData());
    const [monthlyData] = useState(generateMonthlyData());
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const avgAQI = Math.round(weeklyData.reduce((s, d) => s + d.aqi, 0) / weeklyData.length);
    const maxAQI = Math.max(...weeklyData.map((d) => d.aqi));
    const prevAvgAQI = avgAQI + Math.round((Math.random() - 0.5) * 20);
    const improving = avgAQI < prevAvgAQI;
    // AI 7-day prediction
    const sensorHistory = generateMockSensorData();
    const prediction = runLSTMPrediction(sensorHistory.map((d) => d.aqi), sensorHistory.map((d) => d.pm25), sensorHistory.map((d) => d.co2));
    const exportCSV = () => {
        const rows = [
            ['Day', 'AQI', 'PM2.5', 'PM10', 'CO2'],
            ...weeklyData.map((d) => [d.day, d.aqi, d.pm25, d.pm10, d.co2]),
        ];
        const csv = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aq-immune-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "p-4 lg:p-6 space-y-6 min-h-screen", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(motion.h1, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "text-2xl font-bold font-display text-white flex items-center gap-3", children: [_jsx(BarChart3, { className: "w-6 h-6 text-blue-400" }), "Analytics"] }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Trends, comparisons, and AI prediction overlays" })] }), _jsxs("button", { onClick: exportCSV, className: "btn-neon flex items-center gap-2 text-sm", children: [_jsx(Download, { className: "w-4 h-4" }), "Export CSV"] })] }), _jsxs("div", { className: "glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3", children: [_jsx(Calendar, { className: "w-4 h-4 text-slate-400" }), _jsx("span", { className: "text-sm text-slate-400", children: "Filter range:" }), _jsx("input", { type: "date", value: dateFrom, onChange: (e) => setDateFrom(e.target.value), className: "bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300\r\n            focus:outline-none focus:border-cyan-500/50 cursor-pointer" }), _jsx("span", { className: "text-slate-500", children: "to" }), _jsx("input", { type: "date", value: dateTo, onChange: (e) => setDateTo(e.target.value), className: "bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300\r\n            focus:outline-none focus:border-cyan-500/50 cursor-pointer" }), _jsx("button", { className: "btn-neon text-xs py-1.5", children: "Apply" })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                    { label: 'Weekly Avg AQI', value: avgAQI, color: 'text-cyan-400', trend: improving ? '↓ Improving' : '↑ Worsening', trendColor: improving ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'Peak AQI', value: maxAQI, color: 'text-orange-400', trend: 'This week', trendColor: 'text-slate-500' },
                    { label: 'AI 24h Forecast', value: prediction.longTerm[23]?.aqi ?? '–', color: 'text-violet-400', trend: `${prediction.trend}`, trendColor: prediction.trend === 'improving' ? 'text-emerald-400' : prediction.trend === 'worsening' ? 'text-red-400' : 'text-yellow-400' },
                    { label: 'Confidence', value: `${Math.round(prediction.overallConfidence * 100)}%`, color: 'text-emerald-400', trend: 'LSTM Model', trendColor: 'text-slate-500' },
                ].map((stat, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.07 }, className: "glass-card rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-slate-500 uppercase tracking-wider mb-2", children: stat.label }), _jsx("p", { className: `text-3xl font-bold font-display ${stat.color}`, children: stat.value }), _jsx("p", { className: `text-xs mt-1 capitalize font-medium ${stat.trendColor}`, children: stat.trend })] }, stat.label))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "glass-card rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-white font-semibold", children: "Weekly AQI Overview" }), _jsx("span", { className: "text-xs text-slate-500", children: "Mon\u2013Sun" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(BarChart, { data: weeklyData, margin: { top: 5, right: 5, left: -20, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.05)" }), _jsx(XAxis, { dataKey: "day", tick: { fill: '#64748b', fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fill: '#64748b', fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Legend, { wrapperStyle: { fontSize: '12px', color: '#94a3b8' } }), _jsx(Bar, { dataKey: "aqi", name: "AQI", fill: "url(#aqiBarGrad)", radius: [4, 4, 0, 0], children: _jsx("defs", { children: _jsxs("linearGradient", { id: "aqiBarGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#00d4ff", stopOpacity: 0.9 }), _jsx("stop", { offset: "100%", stopColor: "#0ea5e9", stopOpacity: 0.5 })] }) }) }), _jsx(Bar, { dataKey: "pm25", name: "PM2.5", fill: "rgba(249,115,22,0.6)", radius: [4, 4, 0, 0] })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "glass-card rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-white font-semibold", children: "30-Day Pollution Trend vs AI Forecast" }), _jsxs("div", { className: "flex items-center gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-3 h-0.5 bg-cyan-400 rounded" }), _jsx("span", { className: "text-slate-400", children: "Actual AQI" })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-3 h-0.5 bg-violet-400 rounded border-dashed" }), _jsx("span", { className: "text-slate-400", children: "AI Forecast" })] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(AreaChart, { data: monthlyData, margin: { top: 5, right: 5, left: -20, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "actualGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#00d4ff", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#00d4ff", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "forecastGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8b5cf6", stopOpacity: 0.15 }), _jsx("stop", { offset: "95%", stopColor: "#8b5cf6", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.05)" }), _jsx(XAxis, { dataKey: "date", tick: { fill: '#64748b', fontSize: 9 }, axisLine: false, tickLine: false, interval: 4, angle: -30, textAnchor: "end", height: 40 }), _jsx(YAxis, { tick: { fill: '#64748b', fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Area, { type: "monotone", dataKey: "aqi", name: "AQI", stroke: "#00d4ff", strokeWidth: 2, fill: "url(#actualGrad)", dot: false }), _jsx(Area, { type: "monotone", dataKey: "forecast", name: "AI Forecast", stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "5 3", fill: "url(#forecastGrad)", dot: false })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "glass-card rounded-2xl p-6", children: [_jsx("h3", { className: "text-white font-semibold mb-4", children: "Weekly CO\u2082 Levels (ppm)" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(LineChart, { data: weeklyData, margin: { top: 5, right: 5, left: -20, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.05)" }), _jsx(XAxis, { dataKey: "day", tick: { fill: '#64748b', fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fill: '#64748b', fontSize: 11 }, axisLine: false, tickLine: false, domain: [350, 'auto'] }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Line, { type: "monotone", dataKey: "co2", name: "CO2", stroke: "#06ffd4", strokeWidth: 2.5, dot: { r: 4, fill: '#06ffd4', strokeWidth: 2 } })] }) })] })] }));
};
export default AnalyticsPage;
