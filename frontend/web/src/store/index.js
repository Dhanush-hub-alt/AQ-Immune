// Redux Store Setup
import { configureStore, createSlice } from '@reduxjs/toolkit';
// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        token: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});
// Sensors Slice
const sensorsSlice = createSlice({
    name: 'sensors',
    initialState: {
        devices: [],
        selectedDevice: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSensors: (state, action) => {
            state.devices = action.payload;
        },
        setSelectedDevice: (state, action) => {
            state.selectedDevice = action.payload;
        },
        addSensor: (state, action) => {
            state.devices.push(action.payload);
        },
        removeSensor: (state, action) => {
            state.devices = state.devices.filter((d) => d.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});
// Sensor Data Slice
const sensorDataSlice = createSlice({
    name: 'sensorData',
    initialState: {
        data: [],
        loading: false,
        error: null,
        lastUpdate: null,
    },
    reducers: {
        setSensorData: (state, action) => {
            state.data = action.payload;
            state.lastUpdate = new Date();
        },
        addSensorData: (state, action) => {
            state.data.push(action.payload);
            state.lastUpdate = new Date();
        },
        updateSensorData: (state, action) => {
            const index = state.data.findIndex((d) => d.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
            state.lastUpdate = new Date();
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});
// Alerts Slice
const alertsSlice = createSlice({
    name: 'alerts',
    initialState: {
        alerts: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        setAlerts: (state, action) => {
            state.alerts = action.payload;
            state.unreadCount = action.payload.filter((a) => !a.read).length;
        },
        addAlert: (state, action) => {
            state.alerts.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount++;
            }
        },
        markAsRead: (state, action) => {
            const alert = state.alerts.find((a) => a.id === action.payload);
            if (alert && !alert.read) {
                alert.read = true;
                state.unreadCount--;
            }
        },
        removeAlert: (state, action) => {
            const index = state.alerts.findIndex((a) => a.id === action.payload);
            if (index !== -1) {
                if (!state.alerts[index].read) {
                    state.unreadCount--;
                }
                state.alerts.splice(index, 1);
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});
// UI Slice
const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: (localStorage.getItem('theme') || 'dark'),
        sidebarOpen: true,
        notificationsEnabled: true,
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        setNotificationsEnabled: (state, action) => {
            state.notificationsEnabled = action.payload;
        },
    },
});
// Configure store
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        sensors: sensorsSlice.reducer,
        sensorData: sensorDataSlice.reducer,
        alerts: alertsSlice.reducer,
        ui: uiSlice.reducer,
    },
});
// Export actions
export const authActions = authSlice.actions;
export const sensorsActions = sensorsSlice.actions;
export const sensorDataActions = sensorDataSlice.actions;
export const alertsActions = alertsSlice.actions;
export const uiActions = uiSlice.actions;
// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectSensors = (state) => state.sensors.devices;
export const selectSensorData = (state) => state.sensorData.data;
export const selectAlerts = (state) => state.alerts.alerts;
export const selectUnreadAlertCount = (state) => state.alerts.unreadCount;
export const selectTheme = (state) => state.ui.theme;
