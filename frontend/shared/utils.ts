// Shared Utility Functions
export const calculateAQI = (pm25: number): { aqi: number; level: string } => {
  let aqi = 0;
  let level = 'Good';

  if (pm25 <= 12) {
    aqi = (pm25 / 12) * 50;
    level = 'Good';
  } else if (pm25 <= 35.4) {
    aqi = ((pm25 - 12) / (35.4 - 12)) * 50 + 50;
    level = 'Moderate';
  } else if (pm25 <= 55.4) {
    aqi = ((pm25 - 35.4) / (55.4 - 35.4)) * 50 + 100;
    level = 'Unhealthy for Sensitive Groups';
  } else if (pm25 <= 150.4) {
    aqi = ((pm25 - 55.4) / (150.4 - 55.4)) * 50 + 150;
    level = 'Unhealthy';
  } else if (pm25 <= 250.4) {
    aqi = ((pm25 - 150.4) / (250.4 - 150.4)) * 50 + 200;
    level = 'Very Unhealthy';
  } else {
    aqi = Math.min(500, ((pm25 - 250.4) / (500 - 250.4)) * 50 + 250);
    level = 'Hazardous';
  }

  return { aqi: Math.round(aqi), level };
};

export const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#9333ea';
  return '#6b21a8';
};

export const getAQIDescription = (aqi: number) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatNumber = (num: number, decimals = 2) => {
  return num.toFixed(decimals);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

export const generateHealthRecommendations = (aqi: number): string[] => {
  const recommendations: string[] = [];

  if (aqi <= 50) {
    recommendations.push('Air quality is good. Enjoy outdoor activities!');
  } else if (aqi <= 100) {
    recommendations.push('Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.');
  } else if (aqi <= 150) {
    recommendations.push('Limit outdoor activity. Consider wearing an N95 mask if going outside.');
  } else if (aqi <= 200) {
    recommendations.push('Avoid outdoor activity. Use air purifiers indoors.');
  } else if (aqi <= 300) {
    recommendations.push('Stay indoors. Only go outside with proper respiratory protection.');
  } else {
    recommendations.push('Avoid all outdoor activity. Keep windows closed and use air purifiers.');
  }

  return recommendations;
};
