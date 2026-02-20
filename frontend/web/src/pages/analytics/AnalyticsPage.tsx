// Analytics Page — Charts + Date Range Filter + CSV Download
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { generateMockSensorData, runLSTMPrediction } from '@/ai/lstmModel';

// Generate weekly data
const generateWeeklyData = () =>
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
        day,
        aqi: Math.round(Math.random() * 100 + 50),
        pm25: parseFloat((Math.random() * 60 + 15).toFixed(1)),
        pm10: parseFloat((Math.random() * 80 + 20).toFixed(1)),
        co2: Math.round(Math.random() * 300 + 400),
    }));

// Generate monthly data (30 days)
const generateMonthlyData = () =>
    Array.from({ length: 30 }, (_, i) => {
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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card p-3 rounded-xl border border-white/10 text-xs space-y-1">
            <p className="text-slate-400 font-medium">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-300 capitalize">{p.dataKey}:</span>
                    <span className="text-white font-bold">{p.value}</span>
                </div>
            ))}
        </div>
    );
};

export const AnalyticsPage: React.FC = () => {
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
    const prediction = runLSTMPrediction(
        sensorHistory.map((d) => d.aqi),
        sensorHistory.map((d) => d.pm25),
        sensorHistory.map((d) => d.co2)
    );

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
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                        Analytics
                    </motion.h1>
                    <p className="text-slate-400 text-sm mt-1">Trends, comparisons, and AI prediction overlays</p>
                </div>
                <button
                    onClick={exportCSV}
                    className="btn-neon flex items-center gap-2 text-sm"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Date filter */}
            <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Filter range:</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300
            focus:outline-none focus:border-cyan-500/50 cursor-pointer" />
                <span className="text-slate-500">to</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300
            focus:outline-none focus:border-cyan-500/50 cursor-pointer" />
                <button className="btn-neon text-xs py-1.5">Apply</button>
            </div>

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Weekly Avg AQI', value: avgAQI, color: 'text-cyan-400', trend: improving ? '↓ Improving' : '↑ Worsening', trendColor: improving ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'Peak AQI', value: maxAQI, color: 'text-orange-400', trend: 'This week', trendColor: 'text-slate-500' },
                    { label: 'AI 24h Forecast', value: prediction.longTerm[23]?.aqi ?? '–', color: 'text-violet-400', trend: `${prediction.trend}`, trendColor: prediction.trend === 'improving' ? 'text-emerald-400' : prediction.trend === 'worsening' ? 'text-red-400' : 'text-yellow-400' },
                    { label: 'Confidence', value: `${Math.round(prediction.overallConfidence * 100)}%`, color: 'text-emerald-400', trend: 'LSTM Model', trendColor: 'text-slate-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass-card rounded-xl p-4"
                    >
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</p>
                        <p className={`text-xs mt-1 capitalize font-medium ${stat.trendColor}`}>{stat.trend}</p>
                    </motion.div>
                ))}
            </div>

            {/* Weekly AQI Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Weekly AQI Overview</h3>
                    <span className="text-xs text-slate-500">Mon–Sun</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                        <Bar dataKey="aqi" name="AQI" fill="url(#aqiBarGrad)" radius={[4, 4, 0, 0]}>
                            <defs>
                                <linearGradient id="aqiBarGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                        </Bar>
                        <Bar dataKey="pm25" name="PM2.5" fill="rgba(249,115,22,0.6)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Monthly Trend + AI Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">30-Day Pollution Trend vs AI Forecast</h3>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-cyan-400 rounded"></div><span className="text-slate-400">Actual AQI</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-violet-400 rounded border-dashed"></div><span className="text-slate-400">AI Forecast</span></div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false}
                            interval={4} angle={-30} textAnchor="end" height={40} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="aqi" name="AQI" stroke="#00d4ff" strokeWidth={2} fill="url(#actualGrad)" dot={false} />
                        <Area type="monotone" dataKey="forecast" name="AI Forecast" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="5 3" fill="url(#forecastGrad)" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* CO2 Weekly */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6"
            >
                <h3 className="text-white font-semibold mb-4">Weekly CO₂ Levels (ppm)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[350, 'auto']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="co2" name="CO2" stroke="#06ffd4" strokeWidth={2.5}
                            dot={{ r: 4, fill: '#06ffd4', strokeWidth: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default AnalyticsPage;
