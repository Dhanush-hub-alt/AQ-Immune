// Shared constants
export const AQI_THRESHOLDS = {
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

export const API_ENDPOINTS = {
  auth: '/api/auth',
  sensors: '/api/sensors',
  sensorData: '/api/sensors/data',
  users: '/api/users',
  alerts: '/api/alerts',
  reports: '/api/reports',
  admin: '/api/admin',
};

export const STORAGE_KEYS = {
  authToken: 'aq_immune_auth_token',
  refreshToken: 'aq_immune_refresh_token',
  userPreferences: 'aq_immune_user_preferences',
  selectedDevices: 'aq_immune_selected_devices',
  alertHistory: 'aq_immune_alert_history',
  theme: 'aq_immune_theme',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
