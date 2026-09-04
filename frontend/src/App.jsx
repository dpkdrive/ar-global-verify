import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, GuestOnlyRoute } from './routes/RouteGuards';
import WebsiteLayout from './layouts/WebsiteLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import SettingsPage from './pages/SettingsPage';
import RiskMonitorPage from './pages/RiskMonitorPage';
import UsersPage from './pages/UsersPage';
import HomePage from './pages/HomePage';
import { AuditPage } from './pages/Activity';

export default function App() {
  return <Routes>
    <Route element={<WebsiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="verify" element={<VerifyPage />} />
    </Route>
    <Route path="admin/login" element={<GuestOnlyRoute />}>
      <Route index element={<LoginPage />} />
    </Route>
    <Route path="admin" element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="risk-monitor" element={<RiskMonitorPage />} />
        <Route path="activity" element={<AuditPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
