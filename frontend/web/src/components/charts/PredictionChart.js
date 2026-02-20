import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "glass-card p-3 rounded-xl border border-white/10 text-xs space-y-1", children: [_jsx("p", { className: "text-slate-400 font-medium", children: label }), payload.map((p) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: { background: p.color } }), _jsxs("span", { className: "text-slate-300", children: [p.name, ":"] }), _jsx("span", { className: "text-white font-bold", children: p.value })] }, p.dataKey)))] }));
    }
    return null;
};
export const PredictionChart = ({ prediction, className = '' }) => {
    const [view, setView] = useState('6h');
    const data = view === '6h' ? prediction.shortTerm : prediction.longTerm;
    const trendIcon = prediction.trend === 'worsening'
        ? _jsx(TrendingUp, { className: "w-4 h-4 text-red-400" })
        : prediction.trend === 'improving'
            ? _jsx(TrendingDown, { className: "w-4 h-4 text-emerald-400" })
            : _jsx(Minus, { className: "w-4 h-4 text-yellow-400" });
    const trendColor = prediction.trend === 'worsening' ? 'text-red-400'
        : prediction.trend === 'improving' ? 'text-emerald-400'
            : 'text-yellow-400';
    const riskColors = {
        low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (_jsxs("div", { className: `glass-card rounded-2xl p-6 ${className}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center", style: { background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(0,212,255,0.1))', border: '1px solid rgba(139,92,246,0.3)' }, children: _jsx(Brain, { className: "w-5 h-5 text-violet-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-semibold text-sm", children: "AI AQI Forecast" }), _jsx("p", { className: "text-slate-500 text-xs", children: "LSTM Neural Network" })] })] }), _jsx("div", { className: "flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10", children: ['6h', '24h'].map((v) => (_jsx("button", { onClick: () => setView(v), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v
                                ? 'bg-white/15 text-white shadow'
                                : 'text-slate-400 hover:text-white'}`, children: v }, v))) })] }), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [trendIcon, _jsx("span", { className: `text-xs font-semibold capitalize ${trendColor}`, children: prediction.trend })] }), _jsxs("div", { className: `px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${riskColors[prediction.riskLevel]}`, children: [prediction.riskLevel, " risk"] }), _jsxs("div", { className: "ml-auto flex items-center gap-1.5 text-xs text-slate-400", children: [_jsx(Brain, { className: "w-3.5 h-3.5 text-violet-400" }), _jsxs("span", { children: [Math.round(prediction.overallConfidence * 100), "% confidence"] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(AreaChart, { data: data, margin: { top: 5, right: 5, left: -20, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "aqiGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#00d4ff", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#00d4ff", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "pm25Grad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#f97316", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#f97316", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.05)" }), _jsx(XAxis, { dataKey: "label", tick: { fill: '#64748b', fontSize: 10 }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fill: '#64748b', fontSize: 10 }, axisLine: false, tickLine: false }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(ReferenceLine, { y: 100, stroke: "#f97316", strokeDasharray: "4 4", strokeOpacity: 0.5, label: { value: 'Unhealthy', fill: '#f97316', fontSize: 9, position: 'right' } }), _jsx(ReferenceLine, { y: 150, stroke: "#ef4444", strokeDasharray: "4 4", strokeOpacity: 0.5, label: { value: 'Very Unhealthy', fill: '#ef4444', fontSize: 9, position: 'right' } }), _jsx(Area, { type: "monotone", dataKey: "aqi", name: "AQI", stroke: "#00d4ff", strokeWidth: 2, fill: "url(#aqiGrad)", dot: false }), _jsx(Area, { type: "monotone", dataKey: "pm25", name: "PM2.5", stroke: "#f97316", strokeWidth: 1.5, fill: "url(#pm25Grad)", dot: false, strokeDasharray: "5 3" })] }) }), prediction.alert && (_jsxs("div", { className: "mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-orange-400 shrink-0 mt-0.5" }), _jsx("p", { className: "text-xs text-orange-300 leading-snug", children: prediction.alert })] }))] }));
};
export default PredictionChart;
