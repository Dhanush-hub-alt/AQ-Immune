// Mobile App Types (same as web but adapted for React Native)
export interface SensorData {
  id: string;
  sensorId: string;
  deviceName: string;
  location: string;
  latitude: number;
  longitude: number;
  pm25: number;
  pm10: number;
  co2: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
  aqi: number;
  aqiDescription: string;
  status: 'good' | 'moderate' | 'unhealthy_for_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
}

export interface SensorDevice {
  id: string;
  deviceName: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'inactive';
  lastUpdate: Date;
  owner: string;
  timezone: string;
  calibrationDate: Date;
  installationDate: Date;
  notes: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
  notificationSettings: NotificationSettings;
  linkedDevices: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  units: 'metric' | 'imperial';
  aqi_standard: 'us' | 'cn' | 'eu';
  notifications_enabled: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  alert_threshold: {
    pm25: number;
    pm10: number;
    co2: number;
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
  };
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'pm25' | 'pm10' | 'co2' | 'temperature' | 'humidity' | 'device_offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  read: boolean;
  userId: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'activity' | 'indoor' | 'outdoor';
  severity: 'info' | 'warning' | 'critical';
  icon: string;
  timestamp: Date;
  applicable: boolean;
}
