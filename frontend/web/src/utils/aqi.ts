// Simple AQI calculation (US EPA-style for PM2.5 and PM10)
type AQICategory = 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

function linear(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((x - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

function pm25ToAQI(pm25: number) {
  const breaks = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
  ];

  for (const b of breaks) {
    if (pm25 >= b.cLow && pm25 <= b.cHigh) {
      return Math.round(linear(pm25, b.cLow, b.cHigh, b.iLow, b.iHigh));
    }
  }
  return 500;
}

function getAQICategory(aqi: number): { category: AQICategory; color: string } {
  if (aqi <= 50) return { category: 'Good', color: 'badge-aqi-good' };
  if (aqi <= 100) return { category: 'Moderate', color: 'badge-aqi-moderate' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive', color: 'badge-aqi-sensitive' };
  if (aqi <= 200) return { category: 'Unhealthy', color: 'badge-aqi-unhealthy' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: 'badge-aqi-hazardous' };
  return { category: 'Hazardous', color: 'badge-aqi-hazardous' };
}

export function computeAQI(pm25?: number, pm10?: number) {
  if (pm25 !== undefined && pm25 !== null) {
    const aqi = pm25ToAQI(pm25);
    return { aqi, ...(getAQICategory(aqi)) };
  }

  // fallback using PM10 (coarse estimate)
  if (pm10 !== undefined && pm10 !== null) {
    const aqi = Math.min(500, Math.round(pm10 * 2));
    return { aqi, ...(getAQICategory(aqi)) };
  }

  return { aqi: 0, category: 'Good' as AQICategory, color: 'badge-aqi-good' };
}

export default computeAQI;
