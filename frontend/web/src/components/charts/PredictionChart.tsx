import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import type { PredictionResult } from '@/ai/lstmModel';

interface PredictionChartProps {
    prediction: PredictionResult;
    className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 rounded-xl border border-white/10 text-xs space-y-1">
                <p className="text-slate-400 font-medium">{label}</p>
                {payload.map((p: any) => (
                    <div key={p.dataKey} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-300">{p.name}:</span>
                        <span className="text-white font-bold">{p.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const PredictionChart: React.FC<PredictionChartProps> = ({ prediction, className = '' }) => {
    const [view, setView] = useState<'6h' | '24h'>('6h');
    const data = view === '6h' ? prediction.shortTerm : prediction.longTerm;

    const trendIcon = prediction.trend === 'worsening'
        ? <TrendingUp className="w-4 h-4 text-red-400" />
        : prediction.trend === 'improving'
            ? <TrendingDown className="w-4 h-4 text-emerald-400" />
            : <Minus className="w-4 h-4 text-yellow-400" />;

    const trendColor = prediction.trend === 'worsening' ? 'text-red-400'
        : prediction.trend === 'improving' ? 'text-emerald-400'
            : 'text-yellow-400';

    const riskColors: Record<string, string> = {
        low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div className={`glass-card rounded-2xl p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(0,212,255,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}>
                        <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">AI AQI Forecast</h3>
                        <p className="text-slate-500 text-xs">LSTM Neural Network</p>
                    </div>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                    {(['6h', '24h'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v
                                    ? 'bg-white/15 text-white shadow'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics row */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    {trendIcon}
                    <span className={`text-xs font-semibold capitalize ${trendColor}`}>{prediction.trend}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${riskColors[prediction.riskLevel]}`}>
                    {prediction.riskLevel} risk
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
                    <Brain className="w-3.5 h-3.5 text-violet-400" />
                    <span>{Math.round(prediction.overallConfidence * 100)}% confidence</span>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={100} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Unhealthy', fill: '#f97316', fontSize: 9, position: 'right' }} />
                    <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Very Unhealthy', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                    <Area type="monotone" dataKey="aqi" name="AQI" stroke="#00d4ff" strokeWidth={2} fill="url(#aqiGrad)" dot={false} />
                    <Area type="monotone" dataKey="pm25" name="PM2.5" stroke="#f97316" strokeWidth={1.5} fill="url(#pm25Grad)" dot={false} strokeDasharray="5 3" />
                </AreaChart>
            </ResponsiveContainer>

            {/* AI Alert */}
            {prediction.alert && (
                <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-300 leading-snug">{prediction.alert}</p>
                </div>
            )}
        </div>
    );
};

export default PredictionChart;
