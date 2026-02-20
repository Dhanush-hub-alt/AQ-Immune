// API Service with Axios
import axios from 'axios';
import { apiConfig } from '../config';
const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor
instance.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        // Redirect to login
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// Sensor APIs
export const sensorAPI = {
    // Get all sensors
    getAllSensors: async () => {
        const response = await instance.get(apiConfig.endpoints.sensors);
        return response.data;
    },
    // Get sensor by ID
    getSensorById: async (sensorId) => {
        const response = await instance.get(`${apiConfig.endpoints.sensors}/${sensorId}`);
        return response.data;
    },
    // Get sensor data with pagination
    getSensorData: async (sensorId, limit = 50, offset = 0) => {
        const response = await instance.get(`${apiConfig.endpoints.sensorData}/${sensorId}`, {
            params: { limit, offset },
        });
        return response.data;
    },
    // Get latest sensor data
    getLatestSensorData: async (sensorId) => {
        const response = await instance.get(`${apiConfig.endpoints.sensorData}/${sensorId}/latest`);
        return response.data;
    },
    // Add new sensor (Admin only)
    addSensor: async (sensorData) => {
        const response = await instance.post(apiConfig.endpoints.sensors, sensorData);
        return response.data;
    },
    // Update sensor (Admin only)
    updateSensor: async (sensorId, sensorData) => {
        const response = await instance.put(`${apiConfig.endpoints.sensors}/${sensorId}`, sensorData);
        return response.data;
    },
    // Delete sensor (Admin only)
    deleteSensor: async (sensorId) => {
        const response = await instance.delete(`${apiConfig.endpoints.sensors}/${sensorId}`);
        return response.data;
    },
};
// Alert APIs
export const alertAPI = {
    // Get all alerts
    getAllAlerts: async (userId) => {
        const response = await instance.get(apiConfig.endpoints.alerts, {
            params: { userId },
        });
        return response.data;
    },
    // Get alert by ID
    getAlertById: async (alertId) => {
        const response = await instance.get(`${apiConfig.endpoints.alerts}/${alertId}`);
        return response.data;
    },
    // Create alert
    createAlert: async (alertData) => {
        const response = await instance.post(apiConfig.endpoints.alerts, alertData);
        return response.data;
    },
    // Mark alert as read
    markAlertAsRead: async (alertId) => {
        const response = await instance.patch(`${apiConfig.endpoints.alerts}/${alertId}/read`);
        return response.data;
    },
    // Delete alert
    deleteAlert: async (alertId) => {
        const response = await instance.delete(`${apiConfig.endpoints.alerts}/${alertId}`);
        return response.data;
    },
};
// User APIs
export const userAPI = {
    // Get user profile
    getUserProfile: async (userId) => {
        const response = await instance.get(`${apiConfig.endpoints.users}/${userId}`);
        return response.data;
    },
    // Update user profile
    updateUserProfile: async (userId, userData) => {
        const response = await instance.put(`${apiConfig.endpoints.users}/${userId}`, userData);
        return response.data;
    },
    // Get recommendations for user
    getRecommendations: async (userId) => {
        const response = await instance.get(`${apiConfig.endpoints.users}/${userId}/recommendations`);
        return response.data;
    },
};
// Report APIs
export const reportAPI = {
    // Generate historical data report
    generateReport: async (sensorId, startDate, endDate) => {
        const response = await instance.post(apiConfig.endpoints.reports, {
            sensorId,
            startDate,
            endDate,
        });
        return response.data;
    },
    // Get all reports
    getAllReports: async (userId) => {
        const response = await instance.get(apiConfig.endpoints.reports, {
            params: { userId },
        });
        return response.data;
    },
    // Download report
    downloadReport: async (reportId) => {
        const response = await instance.get(`${apiConfig.endpoints.reports}/${reportId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
// Admin APIs
export const adminAPI = {
    // Get dashboard stats
    getDashboardStats: async () => {
        const response = await instance.get(`${apiConfig.endpoints.admin}/stats`);
        return response.data;
    },
    // Get all users
    getAllUsers: async () => {
        const response = await instance.get(`${apiConfig.endpoints.admin}/users`);
        return response.data;
    },
    // Update user role
    updateUserRole: async (userId, role) => {
        const response = await instance.patch(`${apiConfig.endpoints.admin}/users/${userId}/role`, { role });
        return response.data;
    },
    // Get all devices
    getAllDevices: async () => {
        const response = await instance.get(`${apiConfig.endpoints.admin}/devices`);
        return response.data;
    },
    // Get system health
    getSystemHealth: async () => {
        const response = await instance.get(`${apiConfig.endpoints.admin}/health`);
        return response.data;
    },
};
// Export all APIs
// Legacy helper: post sensor data from manual entry or external sources
export const postSensorData = async (payload) => {
    const response = await instance.post(apiConfig.endpoints.sensorData, payload);
    return response.data;
};
// Prediction helper: calls prediction endpoint (backend or ML service)
export const requestPrediction = async (payload) => {
    const response = await instance.post('/api/predict', payload);
    return response;
};
export default {
    sensorAPI,
    alertAPI,
    userAPI,
    reportAPI,
    adminAPI,
};
