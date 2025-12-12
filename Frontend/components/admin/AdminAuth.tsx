import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => localStorage.getItem('pragalbh_admin_auth') === 'true';

export const AdminProtected: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtected;
