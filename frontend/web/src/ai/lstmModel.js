// AI LSTM Model — AQI Prediction Engine
// Simulates a trained LSTM model that forecasts AQI, PM2.5, and pollution levels
// Returns 6-hour and 24-hour predictions with confidence scores
// Logistic-like smoothing function
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
// Simple noise generator for realistic variation
const noise = (scale = 1) => (Math.random() - 0.5) * 2 * scale;
// Trend detection: positive = worsening, negative = improving
const detectTrend = (data) => {
    if (data.length < 2)
        return 0;
    const n = data.length;
    const firstHalf = data.slice(0, Math.floor(n / 2));
    const secondHalf = data.slice(Math.floor(n / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return avgSecond - avgFirst;
};
// LSTM simulation function
export const runLSTMPrediction = (recentAQI, recentPM25, recentCO2) => {
    const lastAQI = recentAQI[recentAQI.length - 1] || 80;
    const lastPM25 = recentPM25[recentPM25.length - 1] || 35;
    const lastCO2 = recentCO2[recentCO2.length - 1] || 450;
    const trendStrength = detectTrend(recentAQI);
    const decayFactor = trendStrength > 0 ? 1.04 : trendStrength < -5 ? 0.97 : 1.0;
    const baseConfidence = 0.87 - (Math.abs(trendStrength) / 200);
    const confidenceDecay = 0.025;
    // Generate 6-hour (short-term) predictions
    const shortTerm = [];
    let runAQI = lastAQI;
    let runPM25 = lastPM25;
    let runCO2 = lastCO2;
    for (let h = 1; h <= 6; h++) {
        runAQI = Math.max(0, Math.min(500, runAQI * decayFactor + noise(4)));
        runPM25 = Math.max(0, runPM25 * decayFactor + noise(2));
        runCO2 = Math.max(300, runCO2 * (decayFactor * 0.5 + 0.5) + noise(10));
        const confidence = Math.max(0.4, baseConfidence - confidenceDecay * h);
        shortTerm.push({
            hour: h,
            aqi: Math.round(runAQI),
            pm25: parseFloat(runPM25.toFixed(1)),
            co2: Math.round(runCO2),
            confidence: parseFloat(confidence.toFixed(2)),
            label: `+${h}h`,
        });
    }
    // Generate 24-hour (long-term) predictions
    const longTerm = [];
    runAQI = lastAQI;
    runPM25 = lastPM25;
    runCO2 = lastCO2;
    // Diurnal cycle: pollution usually peaks at rush hours (8AM, 6PM)
    const now = new Date();
    const currentHour = now.getHours();
    for (let h = 1; h <= 24; h++) {
        const futureHour = (currentHour + h) % 24;
        // Rush hour multiplier
        const rushMultiplier = (futureHour >= 7 && futureHour <= 9) ||
            (futureHour >= 17 && futureHour <= 19)
            ? 1.15 : 1.0;
        // Night reduction
        const nightMultiplier = futureHour >= 0 && futureHour <= 5 ? 0.88 : 1.0;
        const hourMultiplier = decayFactor * rushMultiplier * nightMultiplier;
        runAQI = Math.max(0, Math.min(500, runAQI * hourMultiplier + noise(6)));
        runPM25 = Math.max(0, runPM25 * hourMultiplier + noise(3));
        runCO2 = Math.max(300, runCO2 * (hourMultiplier * 0.3 + 0.7) + noise(15));
        const confidence = Math.max(0.2, baseConfidence - confidenceDecay * 0.6 * h);
        longTerm.push({
            hour: h,
            aqi: Math.round(runAQI),
            pm25: parseFloat(runPM25.toFixed(1)),
            co2: Math.round(runCO2),
            confidence: parseFloat(confidence.toFixed(2)),
            label: futureHour === 0 ? '12AM' :
                futureHour < 12 ? `${futureHour}AM` :
                    futureHour === 12 ? '12PM' :
                        `${futureHour - 12}PM`,
        });
    }
    // Overall trend
    const maxForecastAQI = Math.max(...longTerm.map((p) => p.aqi));
    const trend = trendStrength > 10 ? 'worsening' :
        trendStrength < -10 ? 'improving' : 'stable';
    const riskLevel = maxForecastAQI > 200 ? 'critical' :
        maxForecastAQI > 150 ? 'high' :
            maxForecastAQI > 100 ? 'medium' : 'low';
    const alert = maxForecastAQI > 150
        ? `⚠️ AI predicts AQI will reach ${maxForecastAQI} within 24h. Limit outdoor exposure.`
        : shortTerm.some((p) => p.pm25 > 100)
            ? `⚠️ PM2.5 forecast exceeds safe limits (100 μg/m³) in next 6 hours.`
            : null;
    return {
        shortTerm,
        longTerm,
        overallConfidence: parseFloat(baseConfidence.toFixed(2)),
        trend,
        riskLevel,
        alert,
    };
};
// Generate mock sensor data for demonstration
export const generateMockSensorData = () => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => {
        const hour = (new Date().getHours() - (23 - i) + 24) % 24;
        const rush = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
        const base = rush ? 85 : 55;
        return {
            timestamp: new Date(now - (23 - i) * 3600 * 1000),
            aqi: Math.round(base + Math.random() * 40),
            pm25: parseFloat((base * 0.4 + Math.random() * 20).toFixed(1)),
            pm10: parseFloat((base * 0.6 + Math.random() * 25).toFixed(1)),
            co2: Math.round(400 + base * 2 + Math.random() * 100),
            temperature: parseFloat((22 + Math.random() * 8).toFixed(1)),
            humidity: Math.round(45 + Math.random() * 30),
            no2: parseFloat((20 + Math.random() * 30).toFixed(1)),
            so2: parseFloat((5 + Math.random() * 10).toFixed(1)),
            o3: parseFloat((30 + Math.random() * 40).toFixed(1)),
        };
    });
};
