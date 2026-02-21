// Redux Store Setup
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, SensorData, Alert, SensorDevice } from '../types';

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    loading: false,
    error: null as string | null,
    isAuthenticated: false,
    token: null as string | null,
  },
  reducers: {
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state: any, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setError: (state: any, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state: any) => {
      state.error = null;
    },
    logout: (state: any) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    setToken: (state: any, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

// Sensors Slice
const sensorsSlice = createSlice({
  name: 'sensors',
  initialState: {
    devices: [] as SensorDevice[],
    selectedDevice: null as SensorDevice | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setSensors: (state: any, action: PayloadAction<SensorDevice[]>) => {
      state.devices = action.payload;
    },
    setSelectedDevice: (state: any, action: PayloadAction<SensorDevice | null>) => {
      state.selectedDevice = action.payload;
    },
    addSensor: (state: any, action: PayloadAction<SensorDevice>) => {
      state.devices.push(action.payload);
    },
    removeSensor: (state: any, action: PayloadAction<string>) => {
      state.devices = state.devices.filter((d: any) => d.id !== action.payload);
    },
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: any, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// Sensor Data Slice
const sensorDataSlice = createSlice({
  name: 'sensorData',
  initialState: {
    data: [] as SensorData[],
    loading: false,
    error: null as string | null,
    lastUpdate: null as Date | null,
  },
  reducers: {
    setSensorData: (state: any, action: PayloadAction<SensorData[]>) => {
      state.data = action.payload;
      state.lastUpdate = new Date();
    },
    addSensorData: (state: any, action: PayloadAction<SensorData>) => {
      state.data.push(action.payload);
      state.lastUpdate = new Date();
    },
    updateSensorData: (state: any, action: PayloadAction<SensorData>) => {
      const index = state.data.findIndex((d: any) => d.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
      state.lastUpdate = new Date();
    },
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: any, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// Alerts Slice
const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    alerts: [] as Alert[],
    unreadCount: 0,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setAlerts: (state: any, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter((a: any) => !a.read).length;
    },
    addAlert: (state: any, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount++;
      }
    },
    markAsRead: (state: any, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a: any) => a.id === action.payload);
      if (alert && !alert.read) {
        alert.read = true;
        state.unreadCount--;
      }
    },
    removeAlert: (state: any, action: PayloadAction<string>) => {
      const index = state.alerts.findIndex((a: any) => a.id === action.payload);
      if (index !== -1) {
        if (!state.alerts[index].read) {
          state.unreadCount--;
        }
        state.alerts.splice(index, 1);
      }
    },
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: any, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: (localStorage.getItem('theme') || 'light') as 'light' | 'dark',
    sidebarOpen: true,
    notificationsEnabled: true,
  },
  reducers: {
    setTheme: (state: any, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state: any) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state: any, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setNotificationsEnabled: (state: any, action: PayloadAction<boolean>) => {
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export actions
export const authActions = authSlice.actions;
export const sensorsActions = sensorsSlice.actions;
export const sensorDataActions = sensorDataSlice.actions;
export const alertsActions = alertsSlice.actions;
export const uiActions = uiSlice.actions;

// Export selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectSensors = (state: RootState) => state.sensors.devices;
export const selectSensorData = (state: RootState) => state.sensorData.data;
export const selectAlerts = (state: RootState) => state.alerts.alerts;
export const selectUnreadAlertCount = (state: RootState) => state.alerts.unreadCount;
export const selectTheme = (state: RootState) => state.ui.theme;
