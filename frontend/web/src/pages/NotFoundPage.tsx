// 404 Not Found Page
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Wind, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center max-w-md mx-auto">
                {/* Animated icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                    className="mb-8"
                >
                    <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto"
                            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1))', border: '2px solid rgba(0,212,255,0.2)' }}>
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            >
                                <Wind className="w-16 h-16 text-cyan-400 opacity-80" />
                            </motion.div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                        </div>
                    </div>
                </motion.div>

                {/* 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-8xl font-bold font-display neon-text mb-2">404</h1>
                    <h2 className="text-xl font-semibold text-white mb-3">Page Not Found</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        The air quality data you're looking for seems to have drifted away.
                        This page doesn't exist or may have been moved.
                    </p>
                </motion.div>

                {/* Button */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary inline-flex items-center gap-2 text-sm"
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </motion.button>
            </div>
        </div>
    );
};

export default NotFoundPage;
