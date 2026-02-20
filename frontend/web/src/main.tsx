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
if ((window as any).__aq_immune_alerts_started__ !== true) {
  startAlertsMonitor();
  (window as any).__aq_immune_alerts_started__ = true;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
