import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    // Redirect to login but save the attempted URL to redirect back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
