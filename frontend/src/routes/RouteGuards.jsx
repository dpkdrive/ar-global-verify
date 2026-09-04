import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Spinner } from '../components/ui';

export function ProtectedRoute({ roles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="boot-loader"><Spinner /></div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
}

export function GuestOnlyRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="boot-loader"><Spinner /></div>;
  return user ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
}
