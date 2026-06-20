import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { role } = useAuthStore();

  if (!role || !allowedRoles.includes(role)) {
    // If user is logged in but doesn't have the correct role, send them to unauthorized/dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
