// Firebase Configuration
export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// API Configuration
export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 30000,
    endpoints: {
        auth: '/api/auth',
        sensors: '/api/sensors',
        sensorData: '/api/sensors/data',
        users: '/api/users',
        alerts: '/api/alerts',
        reports: '/api/reports',
        admin: '/api/admin',
    },
};
// Application Configuration
export const appConfig = {
    appName: 'AQ-Immune',
    appVersion: '1.0.0',
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
    debug: import.meta.env.VITE_ENVIRONMENT === 'development',
};
// Feature Flags
export const featureFlags = {
    enableRealTimeUpdates: true,
    enableOfflineSupport: true,
    enableNotifications: true,
    enableAdvancedAnalytics: true,
    enableDarkMode: true,
};
// Chart Configuration
export const chartConfig = {
    defaultTimeRange: '24h', // 24h, 7d, 30d, 1y
    refreshInterval: 5000, // 5 seconds
    animationDuration: 300,
    colors: {
        pm25: '#ef4444',
        pm10: '#f97316',
        co2: '#eab308',
        temperature: '#f59e0b',
        humidity: '#3b82f6',
    },
};
// AQI Thresholds (US EPA Standard)
export const aqiThresholds = {
    pm25: {
        good: 12,
        moderate: 35.4,
        unhealthySensitive: 55.4,
        unhealthy: 150.4,
        veryUnhealthy: 250.4,
        hazardous: 500,
    },
    pm10: {
        good: 54,
        moderate: 154,
        unhealthySensitive: 254,
        unhealthy: 354,
        veryUnhealthy: 424,
        hazardous: 604,
    },
    co2: {
        good: 400,
        moderate: 600,
        unhealthySensitive: 800,
        unhealthy: 1000,
        veryUnhealthy: 1200,
        hazardous: 2000,
    },
};
// Notification Configuration
export const notificationConfig = {
    position: 'top-right',
    duration: 5000,
    animationDuration: 300,
};
// Storage Keys
export const storageKeys = {
    authToken: 'aq_immune_auth_token',
    refreshToken: 'aq_immune_refresh_token',
    userPreferences: 'aq_immune_user_preferences',
    selectedDevices: 'aq_immune_selected_devices',
    alertHistory: 'aq_immune_alert_history',
    theme: 'aq_immune_theme',
};
