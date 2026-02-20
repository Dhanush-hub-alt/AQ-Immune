// Alerts Page — Full Alert History with Filtering + Sound Notifications
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Trash2, Filter, Volume2, VolumeX, BellOff } from 'lucide-react';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface AlertItem {
    id: string;
    message: string;
    detail: string;
    severity: Severity;
    timestamp: Date;
    read: boolean;
    source: string;
    type: 'sensor' | 'ai' | 'system';
}

const generateAlerts = (): AlertItem[] => [
    { id: '1', message: 'PM2.5 Critical Alert', detail: 'PM2.5 concentration reached 125 μg/m³ at Industrial Zone Alpha — 5x WHO safe limit.', severity: 'critical', timestamp: new Date(Date.now() - 2 * 60000), read: false, source: 'Sensor #2', type: 'sensor' },
    { id: '2', message: 'AI Predictive Warning', detail: 'LSTM model predicts AQI will reach 182 within 4 hours at City Center based on traffic + weather patterns.', severity: 'high', timestamp: new Date(Date.now() - 12 * 60000), read: false, source: 'AI Engine', type: 'ai' },
    { id: '3', message: 'CO₂ Threshold Exceeded', detail: 'CO₂ levels at Highway Node 7 exceeded 800 ppm (current: 856 ppm). Increased ventilation recommended.', severity: 'high', timestamp: new Date(Date.now() - 35 * 60000), read: false, source: 'Sensor #4', type: 'sensor' },
    { id: '4', message: 'Sensor #5 Offline', detail: 'Airport Monitor station has been offline for 2 hours. Last known AQI: 95. Manual inspection required.', severity: 'medium', timestamp: new Date(Date.now() - 2 * 3600000), read: true, source: 'System', type: 'system' },
    { id: '5', message: 'AQI Moderate Level', detail: 'AQI at Residential Block B reached 118 — Moderate range. Sensitive groups advised to limit outdoor activity.', severity: 'medium', timestamp: new Date(Date.now() - 3 * 3600000), read: true, source: 'Sensor #6', type: 'sensor' },
    { id: '6', message: 'Air Quality Improved', detail: 'Green Park Sensor reports AQI of 62 — Good range. Air quality has improved significantly from yesterday\'s 95.', severity: 'low', timestamp: new Date(Date.now() - 5 * 3600000), read: true, source: 'Sensor #3', type: 'sensor' },
    { id: '7', message: 'AI: Overnight Improvement Forecast', detail: 'LSTM model predicts AQI will drop to 55 by 3AM due to reduced traffic and improved wind patterns.', severity: 'low', timestamp: new Date(Date.now() - 7 * 3600000), read: true, source: 'AI Engine', type: 'ai' },
];

const severityConfig: Record<Severity, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: <Bell className="w-4 h-4 text-yellow-400" /> },
    low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
};

const formatTime = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.round(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.round(diff / 3600000)} hr ago`;
    return date.toLocaleDateString();
};

export const AlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertItem[]>(generateAlerts());
    const [filter, setFilter] = useState<'all' | 'unread' | Severity>('all');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [typeFilter, setTypeFilter] = useState<'all' | 'sensor' | 'ai' | 'system'>('all');

    const filtered = alerts.filter((a) => {
        if (filter === 'unread') return !a.read;
        if (['critical', 'high', 'medium', 'low'].includes(filter)) return a.severity === filter;
        return true;
    }).filter((a) => typeFilter === 'all' || a.type === typeFilter);

    const unreadCount = alerts.filter((a) => !a.read).length;

    const markRead = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
    const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    const clearAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));
    const clearAll = () => setAlerts([]);

    const typeColors: Record<string, string> = {
        sensor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        ai: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
        system: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
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
                        <Bell className="w-6 h-6 text-orange-400" />
                        Alert Center
                    </motion.h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {unreadCount > 0 ? (
                            <span className="text-orange-400 font-medium">{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</span>
                        ) : 'All alerts read'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2 rounded-xl border transition-all ${soundEnabled
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-white/5 border-white/10 text-slate-400'}`}
                        title="Toggle sound"
                    >
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <button onClick={markAllRead} className="btn-neon text-xs flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Mark All Read
                    </button>
                    <button onClick={clearAll} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
            bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                    { label: 'High', count: alerts.filter(a => a.severity === 'high').length, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                    { label: 'Medium', count: alerts.filter(a => a.severity === 'medium').length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                    { label: 'Low', count: alerts.filter(a => a.severity === 'low').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                ].map((stat, i) => (
                    <motion.button
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => setFilter(stat.label.toLowerCase() as any)}
                        className={`${stat.bg} border ${stat.border} rounded-xl p-3 text-center transition-all hover:scale-[1.02]
              ${filter === stat.label.toLowerCase() ? 'ring-1 ring-white/20' : ''}`}
                    >
                        <p className={`text-2xl font-bold font-display ${stat.color}`}>{stat.count}</p>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                    </motion.button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                {['all', 'unread'].map((f) => (
                    <button key={f} onClick={() => setFilter(f as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize
              ${filter === f ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                        {f === 'all' ? `All (${alerts.length})` : `Unread (${unreadCount})`}
                    </button>
                ))}
                <div className="w-px h-5 bg-white/10" />
                {['all', 'sensor', 'ai', 'system'].map((t) => (
                    <button key={t} onClick={() => setTypeFilter(t as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize
              ${typeFilter === t ? 'bg-violet-500/15 text-violet-400 border-violet-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Alert List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card rounded-2xl p-12 text-center"
                        >
                            <BellOff className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium">No alerts found</p>
                            <p className="text-slate-600 text-sm mt-1">Try changing your filter</p>
                        </motion.div>
                    ) : (
                        filtered.map((alert, index) => {
                            const config = severityConfig[alert.severity];
                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className={`glass-card rounded-2xl p-4 border transition-all hover:border-white/15
                    ${!alert.read ? 'border-white/10' : 'border-white/5'}`}
                                    onClick={() => markRead(alert.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${config.bg} ${config.border}`}>
                                            {config.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <h4 className={`text-sm font-semibold ${!alert.read ? 'text-white' : 'text-slate-300'}`}>
                                                    {alert.message}
                                                </h4>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${typeColors[alert.type]}`}>
                                                    {alert.type}
                                                </span>
                                                {!alert.read && (
                                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed">{alert.detail}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                <span>{alert.source}</span>
                                                <span>·</span>
                                                <span>{formatTime(alert.timestamp)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {!alert.read && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); markRead(alert.id); }}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                                    title="Mark as read"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); clearAlert(alert.id); }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AlertsPage;
