// Login Page — Glassmorphism Design with Animated Background
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Wind, LogIn, Shield, User } from 'lucide-react';
import { isValidEmail } from '@utils';
import { authService, userService } from '@services/firebase';
import { useAppDispatch } from '@hooks';
import { authActions } from '@store';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const state = location.state as { email?: string };
    if (state?.email) setFormData((prev) => ({ ...prev, email: state.email! }));
    // Apply dark class on mount
    document.documentElement.classList.add('dark');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!isValidEmail(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdminLogin = async () => {
    if (formData.email !== 'admin123@gmail.com' || formData.password !== 'admin123') {
      toast.error('Invalid admin credentials');
      return;
    }
    setLoading(true);
    try {
      const adminUser = {
        id: 'admin_user_001',
        displayName: 'Admin User',
        email: 'admin123@gmail.com',
        role: 'admin' as const,
        photoURL: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'dark' as const,
          language: 'en',
          units: 'metric' as const,
          notifications_enabled: true,
          aqi_standard: 'us' as const,
        },
        notificationSettings: {
          email: true, push: true, sms: false,
          alert_threshold: { pm25: 50, pm10: 100, co2: 1000, temperature: { min: 15, max: 35 }, humidity: { min: 30, max: 70 } },
        },
        linkedDevices: [],
      };
      dispatch(authActions.setUser(adminUser));
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const userAuth = await authService.login(formData.email, formData.password);
      const userProfile = await userService.getUserProfile(userAuth.uid);
      if (!userProfile) {
        toast.error('Profile not found. Please sign up first.');
        navigate('/signup');
        return;
      }
      await userService.updateLastLogin(userAuth.uid);
      dispatch(authActions.setUser(userProfile));
      toast.success('Welcome back!');
      navigate(userProfile.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error: any) {
      const msg =
        error.code === 'auth/user-not-found' ? 'User not found. Sign up first.' :
          error.code === 'auth/wrong-password' ? 'Incorrect password.' :
            error.code === 'auth/invalid-credential' ? 'Invalid credentials. Check email and password.' :
              error.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    loginType === 'admin' ? await handleAdminLogin() : await handleUserLogin();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06ffd4 0%, transparent 70%)' }} />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${4 + i * 3}px`, height: `${4 + i * 3}px`,
              left: `${15 + i * 14}%`, top: `${20 + i * 10}%`,
              background: i % 2 === 0 ? '#00d4ff' : '#8b5cf6',
              animationDelay: `${i * 0.8}s`, animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-cyan-400/30"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #06ffd4)' }}
            >
              <Wind className="w-8 h-8 text-white dark:text-slate-900" />
            </motion.div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-cyan-400">AQ-Immune</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">AI Air Quality Intelligence Platform</p>
          </div>

          {/* Login type toggle */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setLoginType('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${loginType === 'user' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm dark:shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <User className="w-4 h-4" /> User
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${loginType === 'admin' ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                  bg-white dark:bg-white/5 border focus:outline-none focus:ring-1 transition-all
                  ${errors.email ? 'border-red-500/50 focus:ring-red-500/30' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                    bg-white dark:bg-white/5 border focus:outline-none focus:ring-1 transition-all
                    ${errors.password ? 'border-red-500/50 focus:ring-red-500/30' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                ${loginType === 'admin'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400'
                  : 'btn-primary'}`}
              style={loginType === 'user' ? { background: 'linear-gradient(135deg, #0ea5e9, #06ffd4)' } : {}}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in...' : `Sign in as ${loginType === 'admin' ? 'Admin' : 'User'}`}
            </button>
          </form>

          {/* Footer */}
          {loginType === 'user' && (
            <p className="text-center text-slate-600 dark:text-slate-500 text-xs mt-6">
              No account?{' '}
              <Link to="/signup" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-semibold">
                Create one here
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
