// Upgraded Dashboard Page — Glassmorphism + AI Predictions + Animated Cards
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Droplets, Activity, Cpu, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { PollutantChart, EnvironmentalChart, CO2Chart, AQITrendChart } from '@components/charts/SensorCharts';
import { PredictionChart } from '@components/charts/PredictionChart';
import { useAppSelector } from '@hooks';
import { selectSensorData, selectUser } from '@store';
import { getAQIColor, getAQIDescription, formatNumber } from '@utils';
import { runLSTMPrediction, generateMockSensorData } from '@/ai/lstmModel';

// Animated counter hook
function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// AQI Circular Gauge
const AQIGauge: React.FC<{ aqi: number; size?: number }> = ({ aqi, size = 120 }) => {
  const clampedAQI = Math.min(Math.max(aqi, 0), 500);
  const percentage = clampedAQI / 500;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - percentage * 0.75);
  const color = getAQIColor(aqi);
  const { status } = getAQIDescription(aqi);
  const animatedAQI = useCountUp(aqi, 1200);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-[135deg]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeDashoffset={0} />
          <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 6px ${color}80)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white font-display">{animatedAQI}</span>
          <span className="text-xs text-slate-400">AQI</span>
        </div>
      </div>
      <span className="text-xs font-semibold mt-1" style={{ color }}>{status}</span>
    </div>
  );
};

// Stat Card
const StatCard: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}> = ({ label, icon, value, unit, gradient, border, trend, trendUp, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="stat-card neon-border-hover"
    style={{ borderColor: border + '30' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: gradient, border: `1px solid ${border}40` }}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border
          ${trendUp ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-end gap-1">
      <span className="text-2xl font-bold text-white font-display">{value}</span>
      {unit && <span className="text-sm text-slate-400 mb-0.5">{unit}</span>}
    </div>
  </motion.div>
);

export const DashboardPage: React.FC = () => {
  const reduxSensorData = useAppSelector(selectSensorData);
  const user = useAppSelector(selectUser);
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const loadData = () => {
    const data = reduxSensorData.length > 0 ? reduxSensorData : generateMockSensorData();
    setSensorData(data);
    const aqis = data.map((d: any) => d.aqi);
    const pm25s = data.map((d: any) => d.pm25);
    const co2s = data.map((d: any) => d.co2);
    setPrediction(runLSTMPrediction(aqis, pm25s, co2s));
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadData();
    intervalRef.current = setInterval(loadData, 5000);
    return () => clearInterval(intervalRef.current);
  }, [reduxSensorData]);

  if (!sensorData.length) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  const latestData = sensorData[sensorData.length - 1];
  const avgAQI = Math.round(sensorData.reduce((s: number, d: any) => s + d.aqi, 0) / sensorData.length);
  const maxPM25 = Math.max(...sensorData.map((d: any) => d.pm25));

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl lg:text-3xl font-bold font-display text-white"
          >
            Air Quality Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm mt-1"
          >
            Welcome back, <span className="text-cyan-400 font-medium">{user?.displayName || 'User'}</span>
            {' '}· Last updated {lastRefresh.toLocaleTimeString()}
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-xs bg-white/5 border border-white/10 text-slate-300 rounded-xl px-3 py-2
              focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button onClick={loadData} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AQI Gauge + Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* AQI Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 glass-card rounded-2xl p-6 flex flex-col items-center justify-center neon-border"
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Current AQI</p>
          <AQIGauge aqi={avgAQI} size={130} />
          <p className="text-xs text-slate-500 mt-3 text-center">
            {getAQIDescription(avgAQI).description.slice(0, 60)}...
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="PM2.5" value={formatNumber(latestData.pm25)} unit="μg/m³"
            icon={<Wind className="w-5 h-5 text-cyan-400" />}
            gradient="linear-gradient(135deg, rgba(0,212,255,0.15), rgba(14,165,233,0.1))"
            border="#00d4ff" trend={`Max: ${formatNumber(maxPM25)}`} trendUp={latestData.pm25 > 50}
            delay={0.1}
          />
          <StatCard
            label="PM10" value={formatNumber(latestData.pm10)} unit="μg/m³"
            icon={<Activity className="w-5 h-5 text-violet-400" />}
            gradient="linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.1))"
            border="#8b5cf6" delay={0.15}
          />
          <StatCard
            label="CO₂" value={formatNumber(latestData.co2)} unit="ppm"
            icon={<Cpu className="w-5 h-5 text-orange-400" />}
            gradient="linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))"
            border="#f97316" trend={latestData.co2 > 800 ? '⚠ High' : 'Normal'}
            trendUp={latestData.co2 > 800} delay={0.2}
          />
          <StatCard
            label="Temperature" value={formatNumber(latestData.temperature)} unit="°C"
            icon={<Thermometer className="w-5 h-5 text-emerald-400" />}
            gradient="linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))"
            border="#10b981" delay={0.25}
          />
          <StatCard
            label="Humidity" value={formatNumber(latestData.humidity)} unit="%"
            icon={<Droplets className="w-5 h-5 text-blue-400" />}
            gradient="linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))"
            border="#3b82f6" delay={0.3}
          />
          <StatCard
            label="NO₂" value={formatNumber(latestData.no2)} unit="μg/m³"
            icon={<AlertCircle className="w-5 h-5 text-red-400" />}
            gradient="linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.1))"
            border="#ef4444" delay={0.35}
          />
          <StatCard
            label="SO₂" value={formatNumber(latestData.so2)} unit="μg/m³"
            icon={<TrendingUp className="w-5 h-5 text-pink-400" />}
            gradient="linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.1))"
            border="#ec4899" delay={0.4}
          />
          <StatCard
            label="Ozone (O₃)" value={formatNumber(latestData.o3)} unit="μg/m³"
            icon={<Wind className="w-5 h-5 text-teal-400" />}
            gradient="linear-gradient(135deg, rgba(20,184,166,0.15), rgba(13,148,136,0.1))"
            border="#14b8a6" delay={0.45}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <PollutantChart data={sensorData} height={300} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <EnvironmentalChart data={sensorData} height={300} />
        </motion.div>
      </div>

      {/* Charts Row 2 + AI Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <CO2Chart data={sensorData} height={270} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <AQITrendChart data={sensorData} height={270} />
        </motion.div>
        {prediction && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <PredictionChart prediction={prediction} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
