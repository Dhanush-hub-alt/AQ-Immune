import { jsx as _jsx } from "react/jsx-runtime";
// Main Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { store } from './store';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { startAlertsMonitor } from './services/alertsMonitor';
// Start background monitors (single-run)
if (window.__aq_immune_alerts_started__ !== true) {
    startAlertsMonitor();
    window.__aq_immune_alerts_started__ = true;
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(HelmetProvider, { children: _jsx(AuthProvider, { children: _jsx(App, {}) }) }) }) }));
