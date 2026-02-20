import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Main App Component — All Routes + Protected Layout
import { useState, useEffect } from 'react';
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
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
};
const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "flex h-screen overflow-hidden", children: [_jsx(Sidebar, { open: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden lg:ml-64", children: [_jsx(Navbar, { onMenuClick: () => setSidebarOpen(!sidebarOpen) }), _jsx("main", { className: "flex-1 overflow-y-auto", children: children })] })] }));
};
// ── App ──────────────────────────────────────────────────
export const App = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const theme = useAppSelector(selectTheme);
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    return (_jsx(Router, { children: _jsxs("div", { className: theme === 'dark' ? 'dark' : '', children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(DashboardPage, {}) }) }) }), _jsx(Route, { path: "/map", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(MapPage, {}) }) }) }), _jsx(Route, { path: "/alerts", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(AlertsPage, {}) }) }) }), _jsx(Route, { path: "/devices", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(DevicesPage, {}) }) }) }), _jsx(Route, { path: "/analytics", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(AnalyticsPage, {}) }) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(UserProfilePage, {}) }) }) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(AdminDashboardPage, {}) }) }) }), _jsx(Route, { path: "/", element: isAuthenticated ? _jsx(Navigate, { to: "/dashboard", replace: true }) : _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, { children: _jsx(NotFoundPage, {}) }) }) })] }), _jsx(Toaster, { position: "top-right", toastOptions: {
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
                    } })] }) }));
};
export default App;
