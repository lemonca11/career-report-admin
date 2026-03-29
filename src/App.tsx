import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import LoginPage from '@/pages/Login';
import AgentApplicationsPage from '@/pages/agents/AgentApplicationsPage';
import AgentDetailPage from '@/pages/agents/AgentDetailPage';
import AgentsListPage from '@/pages/agents/AgentsListPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OrdersListPage from '@/pages/orders/OrdersListPage';
import OrderDetailPage from '@/pages/orders/OrderDetailPage';
import PromptEditPage from '@/pages/prompts/PromptEditPage';
import PromptListPage from '@/pages/prompts/PromptListPage';
import PromptVersionsPage from '@/pages/prompts/PromptVersionsPage';
import QuotaPage from '@/pages/quota/QuotaPage';
import SystemSettingsPage from '@/pages/system/SystemSettingsPage';
import UserDetailPage from '@/pages/users/UserDetailPage';
import UsersListPage from '@/pages/users/UsersListPage';

// Check if user is authenticated
const isAuthenticated = () => {
  return !!(localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token'));
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="agents/applications" element={<AgentApplicationsPage />} />
          <Route path="agents/list" element={<AgentsListPage />} />
          <Route path="agents/:id" element={<AgentDetailPage />} />
          <Route path="quota" element={<QuotaPage />} />
          <Route path="orders/list" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="users/list" element={<UsersListPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="prompts/list" element={<PromptListPage />} />
          <Route path="prompts/:id/edit" element={<PromptEditPage />} />
          <Route path="prompts/:id/versions" element={<PromptVersionsPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
