import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectUser, selectUnreadAlertCount, authActions } from '@store';
import { LayoutDashboard, Map, Bell, BarChart3, User, ShieldCheck, LogOut, Wind, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/firebase';
const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-400' },
    { path: '/map', label: 'Pollution Map', icon: Map, color: 'text-emerald-400' },
    { path: '/alerts', label: 'Alerts', icon: Bell, color: 'text-orange-400', badge: true },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, color: 'text-blue-400' },
    { path: '/profile', label: 'My Profile', icon: User, color: 'text-pink-400' },
];
const adminLinks = [
    { path: '/admin/dashboard', label: 'Admin Panel', icon: ShieldCheck, color: 'text-yellow-400' },
];
export const Sidebar = ({ open, onClose }) => {
    const user = useAppSelector(selectUser);
    const unreadCount = useAppSelector(selectUnreadAlertCount);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(authActions.logout());
            toast.success('Signed out successfully');
            navigate('/login');
            onClose();
        }
        catch {
            toast.error('Failed to sign out');
        }
    };
    const links = user?.role === 'admin' ? [...navLinks, ...adminLinks] : navLinks;
    return (_jsxs(_Fragment, { children: [open && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden", onClick: onClose })), _jsxs("aside", { className: `fixed left-0 top-0 h-screen w-64 z-50 glass-sidebar flex flex-col
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white dark:bg-transparent`, children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center", style: { background: 'linear-gradient(135deg, #00d4ff, #06ffd4)' }, children: _jsx(Wind, { className: "w-5 h-5 text-slate-900" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-bold font-display text-slate-900 dark:text-cyan-400", children: "AQ-Immune" }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-500 -mt-0.5", children: "AI Air Intelligence" })] })] }), _jsx("button", { onClick: onClose, className: "lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto", children: [_jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3", children: "Navigation" }), links.map((link) => {
                                const Icon = link.icon;
                                const showBadge = link.badge && unreadCount > 0;
                                return (_jsx(NavLink, { to: link.path, onClick: onClose, className: ({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                                        ? 'bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg'
                                        : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`, children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center transition-all
                      ${isActive ? 'bg-white dark:bg-white/10 shadow-sm dark:shadow-none' : 'bg-slate-50 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10'}`, children: _jsx(Icon, { className: `w-4 h-4 ${isActive ? link.color : 'text-slate-500 dark:text-slate-400 group-hover:' + link.color}` }) }), _jsx("span", { className: `flex-1 text-sm font-medium ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`, children: link.label }), showBadge && (_jsx("span", { className: "flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white shadow-sm", style: { background: 'linear-gradient(135deg, #ff6b35, #ff2d78)' }, children: unreadCount > 9 ? '9+' : unreadCount })), isActive && _jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 dark:text-slate-500" })] })) }, link.path));
                            })] }), _jsxs("div", { className: "px-3 py-4 border-t border-slate-200 dark:border-white/5 space-y-2", children: [user && (_jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none", children: [_jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-slate-900", style: { background: 'linear-gradient(135deg, #00d4ff, #06ffd4)' }, children: user.displayName?.charAt(0)?.toUpperCase() || 'U' }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-white truncate", children: user.displayName || 'User' }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 truncate capitalize", children: user.role || 'user' })] })] })), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400\r\n              hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 border border-transparent\r\n              hover:border-red-200 dark:hover:border-red-500/20", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5", children: _jsx(LogOut, { className: "w-4 h-4" }) }), _jsx("span", { className: "text-sm font-medium", children: "Sign Out" })] })] })] })] }));
};
export default Sidebar;
