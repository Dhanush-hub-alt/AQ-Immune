// Main App Component — All Routes + Protected Layout
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Sidebar } from '@components/common';

// Pages
import { LoginPage } from '@pages/auth/LoginPage';
import { SignupPage } from '@pages/auth/SignupPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { AdminDashboardPage } from '@pages/admin/AdminDashboardPage';
import { UserProfilePage } from '@pages/profile/UserProfilePage';
import { MapPage } from '@pages/map/MapPage';
import { AlertsPage } from '@pages/alerts/AlertsPage';
import { DevicesPage } from '@pages/devices/DevicesPage';
import { AnalyticsPage } from '@pages/analytics/AnalyticsPage';
import { NotFoundPage } from '@pages/NotFoundPage';

import { useAppSelector } from '@hooks';
import { selectIsAuthenticated, selectTheme } from '@store';
import { Toaster } from 'react-hot-toast';

// ── Protected Route ──────────────────────────────────────
interface ProtectedRouteProps { children: React.ReactNode; }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// ── Main Layout ──────────────────────────────────────────
interface MainLayoutProps { children: React.ReactNode; }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// ── App ──────────────────────────────────────────────────
export const App: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute><MainLayout><MapPage /></MainLayout></ProtectedRoute>
          } />
          <Route path="/alerts" element={
            <ProtectedRoute><MainLayout><AlertsPage /></MainLayout></ProtectedRoute>
          } />
          <Route path="/devices" element={
            <ProtectedRoute><MainLayout><DevicesPage /></MainLayout></ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute><MainLayout><AnalyticsPage /></MainLayout></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><MainLayout><UserProfilePage /></MainLayout></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><MainLayout><AdminDashboardPage /></MainLayout></ProtectedRoute>
          } />

          {/* Root redirect */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />

          {/* 404 */}
          <Route path="*" element={
            <ProtectedRoute><MainLayout><NotFoundPage /></MainLayout></ProtectedRoute>
          } />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#fff',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              backdropFilter: 'blur(16px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
