// Sensor Data Charts
import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { SensorData } from '../../types';
import { formatDateTime } from '../../utils';

interface ChartProps {
  data: SensorData[];
  dataKey?: string;
  title?: string;
  height?: number;
  showLegend?: boolean;
}

// PM2.5 and PM10 Line Chart
export const PollutantChart: React.FC<ChartProps> = ({
  data,
  title = 'Pollutant Levels',
  height = 400,
  showLegend = true,
}) => {
  const chartData = data.map((d) => ({
    timestamp: formatDateTime(d.timestamp),
    pm25: parseFloat(d.pm25.toFixed(2)),
    pm10: parseFloat(d.pm10.toFixed(2)),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="timestamp" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#fff' }}
          />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="pm25"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
            name="PM2.5 (μg/m³)"
          />
          <Line
            type="monotone"
            dataKey="pm10"
            stroke="#f97316"
            dot={false}
            strokeWidth={2}
            name="PM10 (μg/m³)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Temperature and Humidity Chart
export const EnvironmentalChart: React.FC<ChartProps> = ({
  data,
  title = 'Temperature & Humidity',
  height = 400,
  showLegend = true,
}) => {
  const chartData = data.map((d) => ({
    timestamp: formatDateTime(d.timestamp),
    temperature: parseFloat(d.temperature.toFixed(2)),
    humidity: parseFloat(d.humidity.toFixed(2)),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="timestamp" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <YAxis
            stroke="#9ca3af"
            yAxisId="right"
            orientation="right"
            label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#fff' }}
          />
          {showLegend && <Legend />}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#f59e0b"
            dot={false}
            strokeWidth={2}
            name="Temperature (°C)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name="Humidity (%)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// CO2 Level Chart
export const CO2Chart: React.FC<ChartProps> = ({
  data,
  title = 'CO2 Levels',
  height = 400,
  showLegend = true,
}) => {
  const chartData = data.map((d) => ({
    timestamp: formatDateTime(d.timestamp),
    co2: parseFloat(d.co2.toFixed(2)),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="timestamp" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#fff' }}
          />
          {showLegend && <Legend />}
          <ReferenceLine
            y={400}
            stroke="#10b981"
            strokeDasharray="5 5"
            label="Normal Level (400 ppm)"
          />
          <Area
            type="monotone"
            dataKey="co2"
            stroke="#eab308"
            fill="#eab30844"
            name="CO2 (ppm)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// AQI Trend Chart
export const AQITrendChart: React.FC<ChartProps> = ({
  data,
  title = 'AQI Trend',
  height = 400,
  showLegend = true,
}) => {
  const chartData = data.map((d) => ({
    timestamp: formatDateTime(d.timestamp),
    aqi: d.aqi,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="timestamp" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#fff' }}
          />
          {showLegend && <Legend />}
          <ReferenceLine y={50} stroke="#10b981" strokeDasharray="5 5" label="Good (50)" />
          <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="5 5" label="Moderate (100)" />
          <ReferenceLine y={150} stroke="#f97316" strokeDasharray="5 5" label="Unhealthy (150)" />
          <Area
            type="monotone"
            dataKey="aqi"
            stroke="#ef4444"
            fill="#ef444444"
            name="AQI"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  PollutantChart,
  EnvironmentalChart,
  CO2Chart,
  AQITrendChart,
};
