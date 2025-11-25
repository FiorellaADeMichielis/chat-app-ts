import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // If it was not authenticated, send back to auth screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoute;