import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine, } from 'recharts';
import { formatDateTime } from '../../utils';
// PM2.5 and PM10 Line Chart
export const PollutantChart = ({ data, title = 'Pollutant Levels', height = 400, showLegend = true, }) => {
    const chartData = data.map((d) => ({
        timestamp: formatDateTime(d.timestamp),
        pm25: parseFloat(d.pm25.toFixed(2)),
        pm10: parseFloat(d.pm10.toFixed(2)),
    }));
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4", children: [title && _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: title }), _jsx(ResponsiveContainer, { width: "100%", height: height, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "timestamp", stroke: "#9ca3af" }), _jsx(YAxis, { stroke: "#9ca3af" }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                            }, labelStyle: { color: '#fff' } }), showLegend && _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "pm25", stroke: "#ef4444", dot: false, strokeWidth: 2, name: "PM2.5 (\u03BCg/m\u00B3)" }), _jsx(Line, { type: "monotone", dataKey: "pm10", stroke: "#f97316", dot: false, strokeWidth: 2, name: "PM10 (\u03BCg/m\u00B3)" })] }) })] }));
};
// Temperature and Humidity Chart
export const EnvironmentalChart = ({ data, title = 'Temperature & Humidity', height = 400, showLegend = true, }) => {
    const chartData = data.map((d) => ({
        timestamp: formatDateTime(d.timestamp),
        temperature: parseFloat(d.temperature.toFixed(2)),
        humidity: parseFloat(d.humidity.toFixed(2)),
    }));
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4", children: [title && _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: title }), _jsx(ResponsiveContainer, { width: "100%", height: height, children: _jsxs(ComposedChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "timestamp", stroke: "#9ca3af" }), _jsx(YAxis, { stroke: "#9ca3af", yAxisId: "left", label: { value: 'Temperature (°C)', angle: -90, position: 'insideLeft' } }), _jsx(YAxis, { stroke: "#9ca3af", yAxisId: "right", orientation: "right", label: { value: 'Humidity (%)', angle: 90, position: 'insideRight' } }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                            }, labelStyle: { color: '#fff' } }), showLegend && _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "temperature", stroke: "#f59e0b", dot: false, strokeWidth: 2, name: "Temperature (\u00B0C)" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "humidity", stroke: "#3b82f6", dot: false, strokeWidth: 2, name: "Humidity (%)" })] }) })] }));
};
// CO2 Level Chart
export const CO2Chart = ({ data, title = 'CO2 Levels', height = 400, showLegend = true, }) => {
    const chartData = data.map((d) => ({
        timestamp: formatDateTime(d.timestamp),
        co2: parseFloat(d.co2.toFixed(2)),
    }));
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4", children: [title && _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: title }), _jsx(ResponsiveContainer, { width: "100%", height: height, children: _jsxs(AreaChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "timestamp", stroke: "#9ca3af" }), _jsx(YAxis, { stroke: "#9ca3af" }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                            }, labelStyle: { color: '#fff' } }), showLegend && _jsx(Legend, {}), _jsx(ReferenceLine, { y: 400, stroke: "#10b981", strokeDasharray: "5 5", label: "Normal Level (400 ppm)" }), _jsx(Area, { type: "monotone", dataKey: "co2", stroke: "#eab308", fill: "#eab30844", name: "CO2 (ppm)" })] }) })] }));
};
// AQI Trend Chart
export const AQITrendChart = ({ data, title = 'AQI Trend', height = 400, showLegend = true, }) => {
    const chartData = data.map((d) => ({
        timestamp: formatDateTime(d.timestamp),
        aqi: d.aqi,
    }));
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4", children: [title && _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: title }), _jsx(ResponsiveContainer, { width: "100%", height: height, children: _jsxs(AreaChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "timestamp", stroke: "#9ca3af" }), _jsx(YAxis, { stroke: "#9ca3af" }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                            }, labelStyle: { color: '#fff' } }), showLegend && _jsx(Legend, {}), _jsx(ReferenceLine, { y: 50, stroke: "#10b981", strokeDasharray: "5 5", label: "Good (50)" }), _jsx(ReferenceLine, { y: 100, stroke: "#f59e0b", strokeDasharray: "5 5", label: "Moderate (100)" }), _jsx(ReferenceLine, { y: 150, stroke: "#f97316", strokeDasharray: "5 5", label: "Unhealthy (150)" }), _jsx(Area, { type: "monotone", dataKey: "aqi", stroke: "#ef4444", fill: "#ef444444", name: "AQI" })] }) })] }));
};
export default {
    PollutantChart,
    EnvironmentalChart,
    CO2Chart,
    AQITrendChart,
};
