import React from 'react';
import { useAuth } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <div className="p-6">Unauthorized</div>;
  return <>{children}</>;
};

export default ProtectedAdmin;
