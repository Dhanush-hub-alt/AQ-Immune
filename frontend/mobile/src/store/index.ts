// Mobile App Redux Store
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { User, SensorData, Alert, SensorDevice } from '../types';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    loading: false,
    error: null as string | null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState: {
    devices: [] as SensorDevice[],
    selectedDevice: null as SensorDevice | null,
    loading: false,
  },
  reducers: {
    setSensors: (state, action: PayloadAction<SensorDevice[]>) => {
      state.devices = action.payload;
    },
    setSelectedDevice: (state, action: PayloadAction<SensorDevice | null>) => {
      state.selectedDevice = action.payload;
    },
  },
});

const sensorDataSlice = createSlice({
  name: 'sensorData',
  initialState: {
    data: [] as SensorData[],
    loading: false,
    lastUpdate: null as Date | null,
  },
  reducers: {
    setSensorData: (state, action: PayloadAction<SensorData[]>) => {
      state.data = action.payload;
      state.lastUpdate = new Date();
    },
  },
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    alerts: [] as Alert[],
    unreadCount: 0,
  },
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter((a) => !a.read).length;
    },
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sensors: sensorsSlice.reducer,
    sensorData: sensorDataSlice.reducer,
    alerts: alertsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const {
  authActions: authSlice,
  sensorsActions: sensorsSlice,
  sensorDataActions: sensorDataSlice,
  alertsActions: alertsSlice,
} = {
  authActions: authSlice.actions,
  sensorsActions: sensorsSlice.actions,
  sensorDataActions: sensorDataSlice.actions,
  alertsActions: alertsSlice.actions,
};
