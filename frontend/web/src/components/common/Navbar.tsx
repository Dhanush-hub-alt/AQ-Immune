import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectUser, selectUnreadAlertCount, selectTheme, uiActions, authActions } from '@store';
import { Menu, Bell, Sun, Moon, LogOut, Settings, Wifi, ChevronDown, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/firebase';

interface NavbarProps {
  onMenuClick: () => void;
}

const sampleAlerts = [
  { id: '1', message: 'PM2.5 exceeded safe limit (125 μg/m³)', time: '2 min ago', severity: 'critical' as const, read: false },
  { id: '2', message: 'AI predicts AQI will reach 180 in 4 hours', time: '12 min ago', severity: 'high' as const, read: false },
  { id: '3', message: 'Sensor #3 went offline', time: '1 hr ago', severity: 'medium' as const, read: true },
];

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const user = useAppSelector(selectUser);
  const unreadCount = useAppSelector(selectUnreadAlertCount);
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [time, setTime] = useState(new Date());
  const alertRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (alertRef.current && !alertRef.current.contains(e.target as Node)) setShowAlerts(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
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
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const severityColor = (s: string) =>
    s === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
      s === 'high' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
        'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="glass-navbar sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">

        {/* Left: Hamburger + Time */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping-slow"></div>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{timeStr}</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{dateStr}</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">

          {/* Live connection status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span>Live</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Alert Bell */}
          <div className="relative" ref={alertRef}>
            <button
              onClick={() => { setShowAlerts(!showAlerts); setShowProfile(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400
                hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 flex items-center justify-center
                  text-xs font-bold text-white rounded-full animate-pulse"
                  style={{ background: 'linear-gradient(135deg, #ff6b35, #ff2d78)', fontSize: '10px', width: '18px', height: '18px' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Alert Dropdown */}
            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl z-50 animate-fade-in-up">
                <div className="sticky top-0 z-30 glass-navbar w-full border-b border-transparent shadow-sm flex items-center justify-between p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Recent Alerts</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{sampleAlerts.filter(a => !a.read).length} unread</span>
                    <button onClick={() => setShowAlerts(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto w-full">
                  {sampleAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 flex items-start gap-3 ${!alert.read ? 'bg-slate-50 dark:bg-white/5' : ''}`}>
                      <div className={`mt-0.5 p-1.5 rounded-lg border ${severityColor(alert.severity)}`}>
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 dark:text-white/90 font-medium leading-snug">{alert.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{alert.time}</p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/5">
                  <button
                    onClick={() => { navigate('/alerts'); setShowAlerts(false); }}
                    className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 font-medium py-1 transition-colors"
                  >
                    View All Alerts →
                  </button>
                </div>
              </div>
            )}
          </div>
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowAlerts(false); }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl
                  hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-slate-900"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #06ffd4)' }}>
                  {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white leading-none">{user.displayName?.split(' ')[0] || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role || 'user'}</p>
                </div>
                <ChevronDown className="hidden md:block w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-52 glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl z-50 animate-fade-in-up">
                  <div className="p-4 border-b border-slate-100 dark:border-white/5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.displayName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { navigate('/profile'); setShowProfile(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300
                        hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 dark:text-red-400
                        hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
