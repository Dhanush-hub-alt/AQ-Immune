import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectUser, selectUnreadAlertCount, selectTheme, uiActions, authActions } from '@store';
import { Menu, Bell, Sun, Moon, LogOut, Settings, Wifi, ChevronDown, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/firebase';
const sampleAlerts = [
    { id: '1', message: 'PM2.5 exceeded safe limit (125 μg/m³)', time: '2 min ago', severity: 'critical', read: false },
    { id: '2', message: 'AI predicts AQI will reach 180 in 4 hours', time: '12 min ago', severity: 'high', read: false },
    { id: '3', message: 'Sensor #3 went offline', time: '1 hr ago', severity: 'medium', read: true },
];
export const Navbar = ({ onMenuClick }) => {
    const user = useAppSelector(selectUser);
    const unreadCount = useAppSelector(selectUnreadAlertCount);
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showAlerts, setShowAlerts] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [time, setTime] = useState(new Date());
    const alertRef = useRef(null);
    const profileRef = useRef(null);
    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (alertRef.current && !alertRef.current.contains(e.target))
                setShowAlerts(false);
            if (profileRef.current && !profileRef.current.contains(e.target))
                setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(uiActions.setTheme(newTheme));
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };
    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(authActions.logout());
            toast.success('Signed out successfully');
            navigate('/login');
        }
        catch {
            toast.error('Failed to sign out');
        }
    };
    const severityColor = (s) => s === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
        s === 'high' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
            'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return (_jsx("header", { className: "glass-navbar sticky top-0 z-40", children: _jsxs("div", { className: "flex items-center justify-between px-4 lg:px-6 h-16", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: onMenuClick, className: "lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400\r\n              hover:text-white hover:bg-white/10 transition-all", children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsxs("div", { className: "hidden sm:flex items-center gap-2 text-slate-400", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" }), _jsx("span", { className: "text-xs font-mono", children: timeStr }), _jsx("span", { className: "text-slate-600", children: "\u00B7" }), _jsx("span", { className: "text-xs", children: dateStr })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium", children: [_jsx(Wifi, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Live" })] }), _jsx("button", { onClick: handleThemeToggle, className: "w-9 h-9 flex items-center justify-center rounded-xl text-slate-400\r\n              hover:text-white hover:bg-white/10 transition-all", title: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`, children: theme === 'light' ? _jsx(Moon, { className: "w-5 h-5" }) : _jsx(Sun, { className: "w-5 h-5" }) }), _jsxs("div", { className: "relative", ref: alertRef, children: [_jsxs("button", { onClick: () => { setShowAlerts(!showAlerts); setShowProfile(false); }, className: "relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400\r\n                hover:text-white hover:bg-white/10 transition-all", children: [_jsx(Bell, { className: "w-5 h-5" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-4.5 h-4.5 flex items-center justify-center\r\n                  text-xs font-bold text-white rounded-full animate-pulse", style: { background: 'linear-gradient(135deg, #ff6b35, #ff2d78)', fontSize: '10px', width: '18px', height: '18px' }, children: unreadCount > 9 ? '9+' : unreadCount }))] }), showAlerts && (_jsxs("div", { className: "absolute right-0 mt-2 w-80 glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-50 animate-fade-in-up", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-white/5", children: [_jsx("h3", { className: "font-semibold text-white text-sm", children: "Recent Alerts" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-slate-500", children: [sampleAlerts.filter(a => !a.read).length, " unread"] }), _jsx("button", { onClick: () => setShowAlerts(false), className: "text-slate-400 hover:text-white", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "divide-y divide-white/5 max-h-72 overflow-y-auto", children: sampleAlerts.map((alert) => (_jsxs("div", { className: `p-3 flex items-start gap-3 ${!alert.read ? 'bg-white/5' : ''}`, children: [_jsx("div", { className: `mt-0.5 p-1.5 rounded-lg border ${severityColor(alert.severity)}`, children: _jsx(AlertTriangle, { className: "w-3 h-3" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs text-white/90 font-medium leading-snug", children: alert.message }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: alert.time })] }), !alert.read && (_jsx("div", { className: "w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" }))] }, alert.id))) }), _jsx("div", { className: "p-3 border-t border-white/5", children: _jsx("button", { onClick: () => { navigate('/alerts'); setShowAlerts(false); }, className: "w-full text-center text-xs text-cyan-400 hover:text-cyan-300 font-medium py-1 transition-colors", children: "View All Alerts \u2192" }) })] }))] }), user && (_jsxs("div", { className: "relative", ref: profileRef, children: [_jsxs("button", { onClick: () => { setShowProfile(!showProfile); setShowAlerts(false); }, className: "flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl\r\n                  hover:bg-white/10 transition-all border border-transparent hover:border-white/10", children: [_jsx("div", { className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-slate-900", style: { background: 'linear-gradient(135deg, #00d4ff, #06ffd4)' }, children: user.displayName?.charAt(0)?.toUpperCase() || 'U' }), _jsxs("div", { className: "hidden md:block text-left", children: [_jsx("p", { className: "text-xs font-semibold text-white leading-none", children: user.displayName?.split(' ')[0] || 'User' }), _jsx("p", { className: "text-xs text-slate-500 capitalize", children: user.role || 'user' })] }), _jsx(ChevronDown, { className: "hidden md:block w-3.5 h-3.5 text-slate-400" })] }), showProfile && (_jsxs("div", { className: "absolute right-0 mt-2 w-52 glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-50 animate-fade-in-up", children: [_jsxs("div", { className: "p-4 border-b border-white/5", children: [_jsx("p", { className: "text-sm font-semibold text-white", children: user.displayName }), _jsx("p", { className: "text-xs text-slate-500 truncate", children: user.email })] }), _jsxs("div", { className: "p-2", children: [_jsxs("button", { onClick: () => { navigate('/profile'); setShowProfile(false); }, className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300\r\n                        hover:text-white hover:bg-white/10 rounded-xl transition-all", children: [_jsx(Settings, { className: "w-4 h-4" }), " Settings"] }), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400\r\n                        hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all", children: [_jsx(LogOut, { className: "w-4 h-4" }), " Sign Out"] })] })] }))] }))] })] }) }));
};
export default Navbar;
