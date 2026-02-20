// Common Utility Functions for Mobile
import { SensorData } from '../types';

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
    level = 'Unhealthy for Sensitive';
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

  return {
    aqi: Math.round(aqi),
    level,
  };
};

export const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#9333ea';
  return '#6b21a8';
};

export const formatNumber = (num: number, decimals = 2) => {
  return num.toFixed(decimals);
};

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const generateHealthRecommendations = (aqi: number): string[] => {
  const recommendations: string[] = [];

  if (aqi <= 50) {
    recommendations.push('Air quality is good!');
  } else if (aqi <= 100) {
    recommendations.push('Limit intense outdoor exertion.');
  } else if (aqi <= 150) {
    recommendations.push('Avoid outdoor activities.');
    recommendations.push('Wear an N95 mask.');
  } else if (aqi <= 200) {
    recommendations.push('Stay indoors.');
    recommendations.push('Use air purifiers.');
  } else {
    recommendations.push('Avoid all outdoor activities.');
    recommendations.push('Keep windows closed.');
  }

  return recommendations;
};
