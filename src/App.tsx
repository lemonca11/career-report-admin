import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import { message } from 'antd';

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
import AdminManagementPage from '@/pages/system/AdminManagementPage';
import SystemSettingsPage from '@/pages/system/SystemSettingsPage';
import UserDetailPage from '@/pages/users/UserDetailPage';
import UsersListPage from '@/pages/users/UsersListPage';
import { getStoredAdminUser, isSuperAdmin } from '@/utils/auth';

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

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getStoredAdminUser();
  const [api, contextHolder] = message.useMessage();

  React.useEffect(() => {
    if (!isSuperAdmin(user)) {
      api.error('当前账号无权限访问该页面');
    }
  }, [api, user]);

  if (!isSuperAdmin(user)) {
    return (
      <>
        {contextHolder}
        <Navigate to="/dashboard" replace />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
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
          <Route
            path="prompts/list"
            element={
              <SuperAdminRoute>
                <PromptListPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="prompts/:id/edit"
            element={
              <SuperAdminRoute>
                <PromptEditPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="prompts/:id/versions"
            element={
              <SuperAdminRoute>
                <PromptVersionsPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="settings/admins"
            element={
              <SuperAdminRoute>
                <AdminManagementPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="settings"
            element={
              <SuperAdminRoute>
                <SystemSettingsPage />
              </SuperAdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
